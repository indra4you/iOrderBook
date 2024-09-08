export type ProductModel = {
    name: string;
    quantity: number,
    price: number,
};

export class ReferenceData {
    public static readonly Products: ProductModel[] = [
        {
            name: 'Kaju Katri (કાજુ કતરી)',
            quantity: 500,
            price: 430,
        },
        {
            name: 'Kaju Anjir Pan Dry fruit (કાજુ અંજીર પાન ડ્રાયફ્રૂટ)',
            quantity: 500,
            price: 370,
        },
    ];
};