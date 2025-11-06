package br.com.ecologica.validacao;

public class ValidadorCPF {
    public static boolean isCPFValido(String cpf) {
        if (cpf == null || !cpf.matches("\\d{3}\\.?\\d{3}\\.?\\d{3}-?\\d{2}") || cpf.chars().distinct().count() == 1) {
            return false;
        }

        // Remove caracteres não numéricos
        cpf = cpf.replaceAll("[^0-9]", "");

        // Calcula o primeiro dígito verificador
        int soma = 0;
        for (int i = 0; i < 9; i++) {
            soma += Character.getNumericValue(cpf.charAt(i)) * (10 - i);
        }
        int digito1 = 11 - (soma % 11);
        if (digito1 > 9) digito1 = 0;

        // Verifica o primeiro dígito
        if (Character.getNumericValue(cpf.charAt(9)) != digito1) {
            return false;
        }

        // Calcula o segundo dígito verificador
        soma = 0;
        for (int i = 0; i < 10; i++) {
            soma += Character.getNumericValue(cpf.charAt(i)) * (11 - i);
        }
        int digito2 = 11 - (soma % 11);
        if (digito2 > 9) digito2 = 0;

        // Verifica o segundo dígito
        return Character.getNumericValue(cpf.charAt(10)) == digito2;
    }
}