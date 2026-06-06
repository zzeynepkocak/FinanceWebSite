package com.toyota.finance.service;

import dev.samstevens.totp.code.CodeGenerator;
import dev.samstevens.totp.code.CodeVerifier;
import dev.samstevens.totp.code.DefaultCodeGenerator;
import dev.samstevens.totp.code.DefaultCodeVerifier;
import dev.samstevens.totp.code.HashingAlgorithm;
import dev.samstevens.totp.qr.QrData;
import dev.samstevens.totp.qr.QrGenerator;
import dev.samstevens.totp.qr.ZxingPngQrGenerator;
import dev.samstevens.totp.secret.DefaultSecretGenerator;
import dev.samstevens.totp.secret.SecretGenerator;
import dev.samstevens.totp.time.SystemTimeProvider;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;

import static dev.samstevens.totp.util.Utils.getDataUriForImage;

/**
 * İki faktörlü doğrulama (2FA) iş mantığı.
 *
 * <p>TOTP (Time-based One-Time Password) protokolü kullanılarak
 * Google Authenticator / Authy uyumlu 2FA desteği sağlanır.</p>
 *
 * <p>Kullanım akışı:
 * <ol>
 *   <li>Kullanıcı {@code /api/v1/auth/2fa/setup} ile secret üretir ve QR kod alır.</li>
 *   <li>QR kodu Authenticator uygulamasıyla tarar.</li>
 *   <li>Her giriş sırasında {@code /api/v1/auth/2fa/verify} ile kodu doğrular.</li>
 * </ol>
 * </p>
 *
 * @author FinansPortalı
 * @version 1.0
 */
@Service
public class TwoFactorAuthService {

    private static final Logger log = LogManager.getLogger(TwoFactorAuthService.class);

    private static final String ISSUER = "FinansPortalı";

    private final SecretGenerator secretGenerator = new DefaultSecretGenerator();
    private final CodeGenerator codeGenerator = new DefaultCodeGenerator(HashingAlgorithm.SHA1);
    private final CodeVerifier codeVerifier = new DefaultCodeVerifier(codeGenerator, new SystemTimeProvider());

    /**
     * Kullanıcı için yeni TOTP secret oluşturur.
     *
     * @return Base32 kodlanmış secret
     */
    public String generateSecret() {
        return secretGenerator.generate();
    }

    /**
     * Authenticator uygulamasında taranacak QR kod verisini (Data URI) üretir.
     *
     * @param secret   kullanıcıya özel TOTP secret
     * @param username kullanıcı adı (QR etiketinde görünür)
     * @return PNG QR kodunun Base64 Data URI değeri
     * @throws Exception QR kod üretilemezse
     */
    public String generateQrCodeDataUri(String secret, String username) throws Exception {
        QrData data = new QrData.Builder()
                .label(username)
                .secret(secret)
                .issuer(ISSUER)
                .algorithm(HashingAlgorithm.SHA1)
                .digits(6)
                .period(30)
                .build();

        QrGenerator generator = new ZxingPngQrGenerator();
        byte[] imageData = generator.generate(data);
        return getDataUriForImage(imageData, generator.getImageMimeType());
    }

    /**
     * Kullanıcının girdiği kodu TOTP secret ile doğrular.
     *
     * @param secret kullanıcının sakladığı TOTP secret
     * @param code   kullanıcının girdiği 6 haneli kod
     * @return {@code true} — kod geçerli; {@code false} — geçersiz/süresi dolmuş
     */
    public boolean verifyCode(String secret, String code) {
        boolean valid = codeVerifier.isValidCode(secret, code);
        log.debug("2FA kodu doğrulama: geçerli={}", valid);
        return valid;
    }
}
