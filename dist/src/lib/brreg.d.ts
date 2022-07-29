import { NOCompany } from '../../types';
declare type BrregDictionary = Map<string, NOCompany>;
declare type VerboseParam = {
    verbose?: boolean;
};
export declare function downloadFile(): Promise<string>;
export declare function getFile({ verbose }?: VerboseParam): Promise<string>;
export declare function unzip({ filename, verbose }?: VerboseParam & {
    filename?: string;
}): Promise<BrregDictionary>;
export declare function zip(data: any, filename: any): Promise<unknown>;
export declare function init({ verbose }?: VerboseParam): Promise<void>;
export declare function getCompanies({ verbose }?: VerboseParam): Promise<BrregDictionary>;
export declare function getCompany(organisasjonsnummer: string): Promise<NOCompany | undefined>;
export declare function findCompany(query: string): Promise<NOCompany | null>;
export declare function searchCompanies(query: string): Promise<NOCompany[]>;
export {};
