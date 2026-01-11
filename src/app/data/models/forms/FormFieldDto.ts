export interface FormFieldDto {
    id: number;
    name: string | null;
    inputType: string | null;
    inputSelector: string | null;
    valueType: string | null;
    isCumulative: boolean;
    shouldMergeInGroup: boolean;
}
