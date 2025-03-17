export class DatesHelper {
  /**
   * Converts the provided date in yyyy-MM-dd format to dd/MM/yyyy format.
   * @param data - The date in yyyy-MM-dd format.
   * @returns The converted date in dd/MM/yyyy format.
   * @example convertToBrazilianFormat("2024-04-13") // "13/04/2024"
   */
  static convertToBrazilianFormat(data: string): string {
    return data.split("-").reverse().join("/");
  }

  /**
   * Returns today's date in Brazilian format, dd/MM/yyyy.
   *
   * @returns Today's date in Brazilian format.
   * @example getToday() // "13/04/2024"
   */
  static getTodayInBrazilianFormat(): string {
    return new Date()
      .toISOString()
      .split("T")[0]
      .split("-")
      .reverse()
      .join("/");
  }

  /**
   * Returns today's date in ISO format, yyyy-MM-dd.
   *
   * @returns Today's date in ISO format.
   * @example getToday() // "2024-04-13"
   */
  static getToday(): string {
    return new Date().toISOString().split("T")[0];
  }

  /**
   * Removes the seconds from a time.
   * @param horario - The time.
   * @returns The time without the seconds.
   * @example removeSecondsFromTime("12:00:00") // "12:00"
   */
  static removeSecondsFromTime(horario: string): string {
    return horario.split(":").slice(0, 2).join(":");
  }

  /**
   * Converts the provided date in dd/MM/yyyy format to yyyy-MM-dd format.
   * @param data - The date in dd/MM/yyyy format.
   * @returns The converted date in yyyy-MM-dd format.
   * @example convertToISO("13/04/2024") // "2024-04-13"
   */
  static convertToISO(data: string): string {
    return data.split("/").reverse().join("-");
  }

  /**
   * Compiles the provided date in dd/MM/yyyy format and the provided time in HH:mm:ss format into a date and time string.
   * @param data - The date in dd/MM/yyyy format.
   * @param hora - The time in HH:mm:ss format.
   * @returns The compiled date and time.
   * @example compileDateTime("2024/04/13", "12:00:00") // "2024-04-13T12:00:00"
   */
  static compileDateTime(data: string, hora: string): string {
    return `${this.convertToISO(data)}T${hora}`;
  }

  /**
   * Compares how many hours are left for the provided date and time in relation to the current date and time.
   * @param dataHora - The date and time in yyyy-MM-ddTHH:mm:ss format.
   * @returns The difference in hours.
   * @example getDifferenceInHours("2024-04-13T12:00:00") // 24
   * @example getDifferenceInHours("2024-04-13T12:00:00") // -24
   * @example getDifferenceInHours("2024-04-13T12:00:00") // 0
   */
  static getDifferenceInHours(dataHora: string): number {
    const dataHoraEmMilisegundos = new Date(dataHora).getTime();
    const dataHoraAtualEmMilisegundos = new Date().getTime();

    return (
      (dataHoraEmMilisegundos - dataHoraAtualEmMilisegundos) / (60000 * 60)
    );
  }

  /**
   * Compares how many days are left for the provided date in relation to the current date.
   * @param data - The date in yyyy-MM-dd format.
   * @returns The difference in days.
   * @example getDifferenceInDays("2024-04-13") // 24
   * @example getDifferenceInDays("2024-04-13") // -24
   * @example getDifferenceInDays("2024-04-13") // 0
   */
  static getDifferenceInDays(data: string): number {
    const dataAtual = new Date().toISOString().split("T")[0];
    return this.calculateDaysDifference(dataAtual, data);
  }

  /**
   * Calculates the difference in days between two dates
   * @param data1 The first date in yyyy-MM-dd format
   * @param data2 The second date in yyyy-MM-dd format
   * @returns The difference in days, being positive if the second date is greater than the first and negative if the first date is greater than the second
   */
  static calculateDaysDifference(data1: string, data2: string): number {
    const data1EmMilisegundos = new Date(data1).getTime();
    const data2EmMilisegundos = new Date(data2).getTime();

    return (data2EmMilisegundos - data1EmMilisegundos) / (60000 * 60 * 24);
  }

  /**
   * Returns the date of the previous day
   * @param data The reference date in yyyy-MM-dd format
   * @returns Date of the previous day in yyyy-MM-dd format
   */
  static getPreviousDay(data: string): string {
    const dataAtual = new Date(data);
    dataAtual.setDate(dataAtual.getDate() - 1);
    return dataAtual.toISOString().split("T")[0];
  }

  /**
   * Returns the date of the next day
   * @param data The reference date in yyyy-MM-dd format
   * @returns Date of the next day in yyyy-MM-dd format
   */
  static getNextDay(data: string): string {
    const dataAtual = new Date(data);
    dataAtual.setDate(dataAtual.getDate() + 1);
    return dataAtual.toISOString().split("T")[0];
  }

  /**
   * Returns the base date added by n days
   * @param data The reference date in yyyy-MM-dd format
   * @param dias_para_adicionar - How many days to add to the base date
   * @returns Base date added by dias_para_adicionar in yyyy-MM-dd format
   */
  static getDateAfterNDays(data: string, dias_para_adicionar: number): string {
    const dataAtual = new Date(data);
    dataAtual.setDate(dataAtual.getDate() + dias_para_adicionar);
    return dataAtual.toISOString().split("T")[0];
  }

  /**
   * Returns the month prior to the provided date
   * @param data The reference date in yyyy-MM-dd format
   * @returns Date of the previous month in yyyy-MM-dd format
   * @example getPreviousMonth("2024-04-13") // "2024-03-13"
   * @example getPreviousMonth("2024-01-01") // "2023-12-01"
   */
  static getPreviousMonth(data: string): string {
    const dataAtual = new Date(data);
    dataAtual.setDate(0);
    return dataAtual.toISOString().split("T")[0];
  }

  /**
   * Returns the month after the provided date
   * @param data The reference date in yyyy-MM-dd format
   * @returns Date of the next month in yyyy-MM-dd format
   * @example getNextMonth("2024-04-13") // "2024-05-13"
   * @example getNextMonth("2024-12-31") // "2025-01-31"
   */
  static getNextMonth(data: string): string {
    const dataAtual = new Date(data);
    const proximoMes = new Date(
      dataAtual.getFullYear(),
      dataAtual.getMonth() + 2,
      1
    );
    return proximoMes.toISOString().split("T")[0];
  }

  /**
   * Applies a number of hours to the provided time and returns the new time.
   * @param horario The reference time in hh:mm:ss format
   * @param horas The number of hours to be applied. Can be negative or positive.
   * @returns The new time in hh:mm:ss format
   *
   * @example applyHours("12:00:00", 2) // "14:00:00"
   * @example applyHours("12:00:00", -2) // "10:00:00"
   */
  static applyHours(horario: string, horas: number): string {
    const [hh, mm, ss] = horario.split(":").map(Number);
    const dataAtual = new Date();
    dataAtual.setHours(hh, mm, ss);
    dataAtual.setHours(dataAtual.getHours() + horas);
    return dataAtual.toTimeString().split(" ")[0];
  }

  /**
   * Applies a number of hours to the provided time and returns the new time in Brazilian format.
   * @param horario The reference time in hh:mm:ss format.
   * @param horas The number of hours to be applied. Can be negative or positive.
   * @returns The new time in hh:mm:ss format.
   *
   * @example applyHoursBrazilianFormat("12:00:00", 2) // "14:00:00"
   * @example applyHoursBrazilianFormat("12:00:00", -2) // "10:00:00"
   */
  static applyHoursInBrazilianFormat(horario: string, horas: number): string {
    return this.applyHours(horario, horas);
  }
}
