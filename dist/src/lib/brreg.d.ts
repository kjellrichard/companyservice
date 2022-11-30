import { NOCompany, NORole } from '../../types';
declare type BrregDictionary = Map<string, NOCompany>;
declare type BrregRoleDictionary = Map<string, NORole[]>;
declare type VerboseParam = {
    verbose?: boolean;
};
export declare function downloadUnitsFile(): Promise<string>;
export declare function downloadRolesFile(): Promise<string>;
export declare function getUnitsFile({ verbose }?: VerboseParam): Promise<string>;
export declare function getRolesFile({ verbose }?: VerboseParam): Promise<string>;
export declare function unzipUnits({ filename, verbose }: VerboseParam & {
    filename?: string;
}): Promise<BrregDictionary>;
export declare function unzipRoles({ filename, verbose }: VerboseParam & {
    filename?: string;
}): Promise<BrregRoleDictionary>;
export declare function zip(data: any, filename: any): Promise<unknown>;
export declare function init({ verbose }?: VerboseParam): Promise<void>;
export declare function initRoles({ verbose }?: VerboseParam): Promise<void>;
export declare function getCompanies({ verbose }?: VerboseParam): Promise<BrregDictionary>;
export declare function getRoles({ verbose }?: VerboseParam): Promise<BrregRoleDictionary>;
export declare function getCompanyRoles(organisasjonsnummer: string): Promise<NORole[]>;
export declare function getCompany(organisasjonsnummer: string): Promise<NOCompany | undefined>;
export declare function findCompany(query: string, exact?: boolean): Promise<NOCompany | null>;
export declare function searchCompanies(query: string): Promise<NOCompany[]>;
export {};
