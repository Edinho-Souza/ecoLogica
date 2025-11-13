package br.com.ecologica.validacao;

public class ValidadorCPF {
	public static boolean isCPFValido(String cpf) {
		if (cpf == null) {
			return false;
		}
		// Remove caracteres não numéricos
		String cpfLimpo = cpf.replaceAll("[^0-9]", "");
		// Valida o formato e se todos os dígitos são iguais
		if (!cpfLimpo.matches("\\d{11}") || cpfLimpo.chars().distinct().count() == 1) {
			return false;
		}
		try {
			// Calcula o primeiro dígito verificador
			int soma = 0;
			for (int i = 0; i < 9; i++) {
				soma += Character.getNumericValue(cpfLimpo.charAt(i)) * (10 - i);
			}
			int digito1 = 11 - (soma % 11);
			if (digito1 > 9)
				digito1 = 0;
			// Verifica o primeiro dígito
			if (Character.getNumericValue(cpfLimpo.charAt(9)) != digito1) {
				return false;
			}
			// Calcula o segundo dígito verificador
			soma = 0;
			for (int i = 0; i < 10; i++) {
				soma += Character.getNumericValue(cpfLimpo.charAt(i)) * (11 - i);
			}
			int digito2 = 11 - (soma % 11);
			if (digito2 > 9)
				digito2 = 0;
			// Verifica o segundo dígito
			return Character.getNumericValue(cpfLimpo.charAt(10)) == digito2;
		} catch (Exception e) {
			return false;
		}
	}
}