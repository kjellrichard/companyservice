import { NOCompany, NORole } from '../../types';
declare type BrregDictionary = Map<string, NOCompany>;
declare type BrregRoleDictionary = Map<string, NORole[]>;
export declare function getCompanies(count: number): BrregDictionary;
export declare function getRoles(companies: BrregDictionary): BrregRoleDictionary;
export {};
