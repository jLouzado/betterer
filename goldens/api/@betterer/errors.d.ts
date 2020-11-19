export declare class BettererError extends Error {
    details: BettererErrorDetails;
    isBettererError: boolean;
    constructor(message: string, ...details: BettererErrorDetails);
}

export declare type BettererErrorDetail = string | ErrorLike | BettererError;

export declare type BettererErrorDetails = ReadonlyArray<BettererErrorDetail>;

export declare type ErrorLike = {
    message: string;
    stack: string;
};
