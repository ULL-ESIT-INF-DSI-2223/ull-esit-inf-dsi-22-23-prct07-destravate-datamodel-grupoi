export class GeneradorIdUnicos {
  private static instance: GeneradorIdUnicos;
  private contadorIds: number;

  private constructor() {
    this.contadorIds = 0;
  }

  public static getInstance(): GeneradorIdUnicos {
    if (!GeneradorIdUnicos.instance) {
      GeneradorIdUnicos.instance = new GeneradorIdUnicos();
    }

    return GeneradorIdUnicos.instance;
  }

  public generateUniqueId(): string {
    const newId = `id-${this.contadorIds}`;
    this.contadorIds++;
    return newId;
  }
}