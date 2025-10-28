package br.com.ecologica.validacao;

public class ValidadorCPF {

    public static boolean isCPFValido(String cpf) {
        if (cpf == null || !cpf.matches("\\d{11}") || cpf.chars().distinct().count() == 1) {
            return false;
        }

        int[] pesos1 = {10, 9, 8, 7, 6, 5, 4, 3, 2};
        int[] pesos2 = {11, 10, 9, 8, 7, 6, 5, 4, 3, 2};

        try {
            int soma1 = 0, soma2 = 0;
            for (int i = 0; i < 9; i++) {
                int digito = Character.getNumericValue(cpf.charAt(i));
                soma1 += digito * pesos1[i];
                soma2 += digito * pesos2[i];
            }

            int digito1 = soma1 % 11 < 2 ? 0 : 11 - (soma1 % 11);
            soma2 += digito1 * pesos2[9];
            int digito2 = soma2 % 11 < 2 ? 0 : 11 - (soma2 % 11);

            return cpf.endsWith("" + digito1 + digito2);
        } catch (Exception e) {
            return false;
        }
    }
}