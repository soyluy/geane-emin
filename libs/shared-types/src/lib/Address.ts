export class Address {
    constructor(
        public street: string, // cadde
        public city: string,   // şehir
        public postalCode: string, // posta kodu
        public district?: string, // ilçe
        public neighborhood?: string, // mahalle
        public buildingNumber?: string, // bina numarası
        public apartmentNumber?: string, // daire numarası
        public state?: string, // eyalet
        public country?: string // ülke
    ) {}

    toString(): string {
    // TODO: Implement a more comprehensive toString method
        return `${this.street}, ${this.city}, `;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromObject(obj: any): Address {
    // TODO: Implement a more comprehensive fromObject method
        return new Address(
            obj.street,
            obj.city,
            obj.postalCode,
        );
    }
}