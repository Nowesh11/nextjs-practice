
export function formatPrice(cents:number):string {
    if (isNaN(cents)) return '$0.00';
    return `$${(cents / 100).toFixed(2)}`;
}

export function isValidEmail(email:string):boolean{
    return email.includes("@") && email.includes(".");
}

export function truncateText(text:string, maxLength:number):string{
    if(text.length <= maxLength){
        return text;
    }
    return text.slice(0, maxLength) + "...";
}