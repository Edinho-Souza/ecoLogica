package br.com.ecologica.validacao;

public class ValidadorCNPJ {
    public static boolean isCNPJValido(String cnpj) {
        if (cnpj == null || !cnpj.matches("\\d{14}") || cnpj.chars().distinct().count() == 1) {
            return false;
        }
        int[] pesos1 = {5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2};
        int[] pesos2 = {6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2};
        try {
            int soma1 = 0, soma2 = 0;
            for (int i = 0; i < 12; i++) {
                int digito = Character.getNumericValue(cnpj.charAt(i));
                soma1 += digito * pesos1[i];
                soma2 += digito * pesos2[i];
            }
            int digito1 = soma1 % 11 < 2 ? 0 : 11 - (soma1 % 11);
            soma2 += digito1 * pesos2[12];
            int digito2 = soma2 % 11 < 2 ? 0 : 11 - (soma2 % 11);
            return cnpj.endsWith("" + digito1 + digito2);
        } catch (Exception e) {
            return false;
        }
    }
}