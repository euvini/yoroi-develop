import { BanxaCoinType } from '../helpers/coin-types';
import { BanxaFiatType } from '../helpers/fiat-types';
import { handleZodErrors } from '../adapters/zod-errors';
import { BanxaBlockchainCode } from '../helpers/blockchain-code';
/**
 * Creates an object that provides functionality to Banxa capabilities.
 *
 * @param {BanxaUrlReferralBuilderOptions} options - Configuration options for the referral link generation.
 * @param {string} [options.partner] - The partner name, e.g., "checkout".
 * @param {boolean} [options.isProduction=false] - Indicates if the function should generate production or sandbox URLs.
 *
 * @returns {BanxaModule} An object with methods to generate Banxa referral links.
 */
export declare const banxaModuleMaker: ({ partner, isProduction }: BanxaReferralUrlBuilderOptions, { zodErrorTranslator }?: {
    zodErrorTranslator?: typeof handleZodErrors | undefined;
}) => BanxaModule;
export type BanxaReferralUrlBuilderOptions = {
    /** Partner name, e.g., emurgo. */
    partner: string;
    /** Indicates that is running on production enviroment, otherwise will fallback to the sandbox */
    isProduction?: boolean;
};
export type BanxaReferralUrlQueryStringParams = {
    /** Can be used to indicate whether the customer wants to sell by passing through a value of sell. The customer will be shown the Sell Order Form when they are redirected to Banxa. If this parameter is not passed, then the order will default to buy */
    orderType?: 'sell' | 'buy';
    /** Fiat currency code that the customer wants to exchange e.g USD */
    fiatType: BanxaFiatType;
    /** Fiat amount that the customer wants to exchange, takes precedence over coinAmount. */
    fiatAmount?: number;
    /** Coin currency code that the customer wants to exchange, e.g., ETH. */
    coinType: BanxaCoinType;
    /** Coin amount that the customer wants to exchange. */
    coinAmount?: number;
    /** It defaults to the blockchain configured for the coinType selected, e.g., ADA -> Cardano. */
    blockchain?: BanxaBlockchainCode;
    /** Customer’s wallet address. */
    walletAddress: string;
    /** Customer's wallet tag or memo. This is required for transacting on certain blockchains such as BNB and XRP. */
    walletAddressTag?: string;
    /** A solid background color. This will override Banxa's custom themes. Will take a hex value without the hash (#) e.g. ffffff */
    backgroundColor?: string;
    /** The color used for active buttons. Will take a hex value without the hash (#) e.g. ffffff */
    primaryColor?: string;
    /** The color used for button hover effects. Will take a hex value without the hash (#) e.g. ffffff */
    secondaryColor?: string;
    /** The color used for all text in the checkout flow. Will take a hex value without the hash (#) e.g. ffffff  */
    textColor?: string;
    /** Used to apply the correct contrast based on the selected background color. We suggest that for dark backgrounds, you use a dark theme so that input fields are contrasted correctly. */
    theme?: 'light' | 'dark';
    /** This is the url that users will be redirected to when they have completed or cancel the order process. e.g. https://{returnUrl}.com) */
    returnUrl?: string;
};
export type BanxaModule = {
    /**
     * Generates a Banxa referral link based on the provided query parameters.
     *
     * @param {BanxaReferralUrlQueryStringParams} queries - The query parameters for the referral link.
     * @param {boolean} [queries.sellMode] - Indicates whether the customer wants to sell. If this parameter is not passed, then the order will default to buyMode.
     * @param {string} [queries.fiatType] - Fiat currency code that the customer wants to exchange, e.g., "USD".
     * @param {number} [queries.fiatAmount] - Fiat amount that the customer wants to exchange, takes precedence over coinAmount.
     * @param {string} [queries.coinType] - Coin currency code that the customer wants to exchange, e.g., "ADA".
     * @param {number} [queries.coinAmount] - Coin amount that the customer wants to exchange.
     * @param {string} [queries.blockchain] - It defaults to the blockchain configured for the coinType selected, e.g., "ADA" -> "Cardano".
     * @param {string} [queries.walletAddress] - Customer's wallet address.
     * @param {string} [queries.walletAddressTag] - Customer's wallet tag or memo. This is required for transacting on certain blockchains such as BNB and XRP.
     * @param {string} [queries.backgroundColor] - A solid background color. This will override Banxa's custom themes. Will take a hex value without the hash (#) e.g. ffffff.
     * @param {string} [queries.primaryColor] - The color used for active buttons. Will take a hex value without the hash (#) e.g. ffffff.
     * @param {string} [queries.secondaryColor] - The color used for button hover effects. Will take a hex value without the hash (#) e.g. ffffff.
     * @param {string} [queries.textColor] - The color used for all text in the checkout flow. Will take a hex value without the hash (#) e.g. ffffff.
     * @param {string} [queries.theme] - Used to apply the correct contrast based on the selected background color. We suggest that for dark backgrounds, you use a dark theme so that input fields are contrasted correctly.
     * @param {string} [queries.returnUrl] - This is the url that users will be redirected to when they have completed or cancel the order process. e.g. https://{returnUrl}.com.
     *
     * @throws {BanxaValidationError | BanxaUnknownError} Throws an error if the provided data doesn't match with the schema or if something unexpected happens.
     *
     * @returns {URL} The generated Banxa referral link as URL object.
     */
    readonly createReferralUrl: (queries: BanxaReferralUrlQueryStringParams) => URL;
};
//# sourceMappingURL=module.d.ts.map