/**
 * Utilidades para cálculo y validación de CUIL/CUIT en Argentina (Módulo 11)
 */

export interface CuilCalculado {
  dni: string;
  cuilMasculino: string;
  cuilFemenino: string;
  cuilRepetido: string;
  cuilFormateadoM: string;
  cuilFormateadoF: string;
}

/**
 * Calcula los posibles CUIL válidos para un DNI argentino
 */
export function calcularCuils(dniInput: string | number): CuilCalculado {
  const dniLimpio = dniInput.toString().replace(/\D/g, '');
  const dni8 = dniLimpio.padStart(8, '0');

  const serie = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];

  function resolver(prefijo: string): { prefijo: string; digito: number } {
    const diez = prefijo + dni8;
    let suma = 0;
    for (let i = 0; i < 10; i++) {
      suma += parseInt(diez[i], 10) * serie[i];
    }
    const resto = suma % 11;
    if (resto === 0) return { prefijo, digito: 0 };
    if (resto === 1) {
      if (prefijo === '20') return { prefijo: '23', digito: 9 };
      if (prefijo === '27') return { prefijo: '23', digito: 4 };
      return { prefijo: '23', digito: 0 };
    }
    return { prefijo, digito: 11 - resto };
  }

  const resM = resolver('20');
  const resF = resolver('27');
  const resR = resolver('23');

  const cuilM = `${resM.prefijo}${dni8}${resM.digito}`;
  const cuilF = `${resF.prefijo}${dni8}${resF.digito}`;
  const cuilR = `${resR.prefijo}${dni8}${resR.digito}`;

  return {
    dni: dniLimpio,
    cuilMasculino: cuilM,
    cuilFemenino: cuilF,
    cuilRepetido: cuilR,
    cuilFormateadoM: `${resM.prefijo}-${dni8}-${resM.digito}`,
    cuilFormateadoF: `${resF.prefijo}-${dni8}-${resF.digito}`,
  };
}

/**
 * Valida si un CUIL/CUIT argentino es matemáticamente válido
 */
export function validarCuil(cuilInput: string): boolean {
  const cuil = cuilInput.replace(/\D/g, '');
  if (cuil.length !== 11) return false;

  const serie = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  let suma = 0;
  for (let i = 0; i < 10; i++) {
    suma += parseInt(cuil[i], 10) * serie[i];
  }
  const resto = suma % 11;
  const digitoVerificador = parseInt(cuil[10], 10);

  if (resto === 0) return digitoVerificador === 0;
  if (resto === 1) return (cuil.startsWith('23') && (digitoVerificador === 9 || digitoVerificador === 4));
  return digitoVerificador === (11 - resto);
}
