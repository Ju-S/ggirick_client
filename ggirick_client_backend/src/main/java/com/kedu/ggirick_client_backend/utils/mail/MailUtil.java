package com.kedu.ggirick_client_backend.utils.mail;

public class MailUtil {
    private static final String DOMAIN = "@ggirick.site";

    // full email -> local part (kiwiiboy0@ggirick.site -> kiwiiboy0)
    public static String extractLocalPart(String email) {
        if (email == null) return null;
        email = email.trim();
        int at = email.indexOf("@");
        return at > 0 ? email.substring(0, at) : email;
    }

    // local part -> full email (kiwiiboy0 -> kiwiiboy0@ggirick.site)
    public static String toFullEmail(String localPart) {
        if (localPart == null) return null;
        String s = localPart.trim();
        if (s.isEmpty()) return s;
        if (s.contains("@")) return s;
        return s + DOMAIN;
    }

    // normalize incoming email (trim)
    public static String normalize(String email) {
        return email == null ? null : email.trim();
    }
}