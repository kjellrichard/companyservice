declare type CompanyInfo = {
    OrgNo: string;
    Name: string;
    City: string;
    'None': number;
    'Micro 1–9': number;
    'Small 10–49': number;
    'Medium 50–249': number;
    'Large 250+': number;
    Total: number;
};
declare type AccountantInfo = {
    [orgNo: string]: CompanyInfo;
};
export declare function countRegnskap({ verbose }: {
    verbose?: boolean;
}): Promise<AccountantInfo>;
export {};
