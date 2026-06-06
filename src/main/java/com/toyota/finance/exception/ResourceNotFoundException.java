package com.toyota.finance.exception;

/**
 * İstenen kaynak veritabanında bulunamadığında fırlatılan istisna.
 *
 * <p>{@link GlobalExceptionHandler} tarafından yakalanarak HTTP 404 döndürülür.</p>
 *
 * @author FinansPortalı
 * @version 1.0
 */
public class ResourceNotFoundException extends RuntimeException {

    /**
     * @param message hatanın açıklaması
     */
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
