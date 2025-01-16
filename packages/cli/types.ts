export interface User {
    name:      string;
    age:       number;
    addresses: Address[];
}

export interface Address {
    street: string;
    city:   string;
}
