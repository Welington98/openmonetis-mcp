// Gerado por scripts/gen-contract.ts a partir de http://localhost:7001/openapi.json
// OpenMonetis 0.16.0 — não edite à mão.
export interface paths {
    "/auth-config": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Public authentication capabilities; contains no credentials */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["AuthConfig"];
                            error: unknown;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/auth/device/verify": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Valid Companion token */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["CompanionDeviceVerification"];
                    };
                };
                /** @description Invalid Companion token */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["CompanionDeviceAuthenticationError"];
                    };
                };
                /** @description Too many verification attempts */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["CompanionDeviceAuthenticationError"];
                    };
                };
                /** @description Internal error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/accounts": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    period?: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description List accounts */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["AccountOutput"][];
                            error: unknown;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["CreateAccountInput"];
                };
            };
            responses: {
                /** @description Created account */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["AccountOutput"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/accounts/{id}/yields": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["AddAccountYieldInput"];
                };
            };
            responses: {
                /** @description Account yield added */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["AccountOutput"];
                            error: unknown;
                        };
                    };
                };
                /** @description Yield must increase the account balance */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Account not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/accounts/{id}/cash-flow": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    period?: string;
                };
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Daily account flow and twelve-month history */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["AccountCashFlowOutput"];
                            error: unknown;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Account not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/accounts/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    period?: string;
                };
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Get account */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["AccountOutput"];
                            error: unknown;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Account not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["ReplaceAccountInput"];
                };
            };
            responses: {
                /** @description Replaced account */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["AccountOutput"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Account not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        post?: never;
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Permanently deleted inactive account and its financial records */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: {
                                /** Format: uuid */
                                id: string;
                            };
                            error: unknown;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Account not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Account must be inactive before permanent deletion */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["UpdateAccountInput"];
                };
            };
            responses: {
                /** @description Updated account */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["AccountOutput"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Account not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        trace?: never;
    };
    "/accounts/{id}/balance-adjustments": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["AdjustAccountBalanceInput"];
                };
            };
            responses: {
                /** @description Adjusted account balance */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["AccountBalanceAdjustmentOutput"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Account not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/accounts/{id}/balance-adjustments/preview": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["AdjustAccountBalanceInput"];
                };
            };
            responses: {
                /** @description Read-only balance adjustment preview */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["AccountBalanceAdjustmentPreview"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid adjustment */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Account not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/cards": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    period?: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description List cards */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["CardOutput"][];
                            error: unknown;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["CreateCardInput"];
                };
            };
            responses: {
                /** @description Created card */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["CardOutput"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Card not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/cards/{id}/invoice-period": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query: {
                    purchaseDate: string;
                };
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Calculated invoice period for a purchase */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["CardInvoicePeriodOutput"];
                            error: unknown;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Card not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/cards/{id}/invoice-history": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    period?: string;
                };
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Last twelve invoice amounts through the selected period */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["CardInvoiceHistoryOutput"];
                            error: unknown;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Card not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/cards/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    period?: string;
                };
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Get card */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["CardOutput"];
                            error: unknown;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Card not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["ReplaceCardInput"];
                };
            };
            responses: {
                /** @description Replaced card */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["CardOutput"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Card not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        post?: never;
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Permanently deleted inactive card and its financial records */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: {
                                /** Format: uuid */
                                id: string;
                            };
                            error: unknown;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Card not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Card must be inactive before permanent deletion */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["UpdateCardInput"];
                };
            };
            responses: {
                /** @description Updated card */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["CardOutput"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Card not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        trace?: never;
    };
    "/budgets": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query: {
                    period: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Budget overview for a period */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["BudgetOverview"];
                            error: unknown;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["CreateBudgetInput"];
                };
            };
            responses: {
                /** @description Created budget */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["Budget"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid or duplicate budget */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Expense category not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/budgets/copy-previous": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["CopyPreviousBudgetsInput"];
                };
            };
            responses: {
                /** @description Copied budgets from the previous period */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["CopyPreviousBudgetsOutput"];
                            error: unknown;
                        };
                    };
                };
                /** @description No budgets available to copy */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/budgets/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Get budget */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["Budget"];
                            error: unknown;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Budget not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Deleted budget */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: {
                                /** Format: uuid */
                                id: string;
                            };
                            error: unknown;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Budget not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["UpdateBudgetInput"];
                };
            };
            responses: {
                /** @description Updated budget */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["Budget"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Budget not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        trace?: never;
    };
    "/goals": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Goals for the authenticated user */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["Goal"][];
                            error: unknown;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["CreateGoalInput"];
                };
            };
            responses: {
                /** @description Created goal */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["Goal"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid goal */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Linked account not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/goals/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Get goal */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["Goal"];
                            error: unknown;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Goal not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Deleted goal */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: {
                                /** Format: uuid */
                                id: string;
                            };
                            error: unknown;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Goal not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["UpdateGoalInput"];
                };
            };
            responses: {
                /** @description Updated goal */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["Goal"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid goal update */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Goal not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        trace?: never;
    };
    "/bills": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query: {
                    period: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Bills dashboard snapshot */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["DashboardBills"];
                            error: unknown;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/bills/{period}/payments": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    period: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["CreateBillPaymentInput"];
                };
            };
            responses: {
                /** @description Bill payment registered */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: {
                                id: string;
                                /** Format: uuid */
                                accountId: string;
                                /** Format: date */
                                paidAt: string;
                            };
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid bill payment */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Bill or account not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/categories": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description List categories */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["CategoryOutput"][];
                            error: unknown;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["CreateCategoryInput"];
                };
            };
            responses: {
                /** @description Created category */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["CategoryOutput"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid request or category hierarchy */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Category name already exists in this group */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/categories/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Get category */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["CategoryOutput"];
                            error: unknown;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Category not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["ReplaceCategoryInput"];
                };
            };
            responses: {
                /** @description Replaced category */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["CategoryOutput"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid request or category hierarchy */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Category not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Category name already exists in this group */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        post?: never;
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Deleted category */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: {
                                /** Format: uuid */
                                id: string;
                            };
                            error: unknown;
                        };
                    };
                };
                /** @description Category has subcategories or financial references */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Category not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["UpdateCategoryInput"];
                };
            };
            responses: {
                /** @description Updated category */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["CategoryOutput"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid request or category hierarchy */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Category not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Category name already exists in this group */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        trace?: never;
    };
    "/tags": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description List tags */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["TagOutput"][];
                            error: unknown;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["CreateTagInput"];
                };
            };
            responses: {
                /** @description Created tag */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["TagOutput"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Tag already exists */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tags/report": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query: {
                    period: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Monthly totals per tag */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["TagsReport"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tags/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Deleted tag and its assignments */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: {
                                /** Format: uuid */
                                id: string;
                            };
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Tag not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["UpdateTagInput"];
                };
            };
            responses: {
                /** @description Updated tag */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["TagOutput"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Tag not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Tag already exists */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        trace?: never;
    };
    "/people": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description List people */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["PersonOutput"][];
                            error: unknown;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["CreatePersonInput"];
                };
            };
            responses: {
                /** @description Created person */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["PersonOutput"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/people/admin": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Get admin person */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["PersonOutput"];
                            error: unknown;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Admin person not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/people/{id}/summary": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query: {
                    period: string;
                };
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Get person financial summary */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["PersonFinancialSummaryOutput"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid period */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Person not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/people/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Get person */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["PersonOutput"];
                            error: unknown;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Person not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["ReplacePersonInput"];
                };
            };
            responses: {
                /** @description Replaced person */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["PersonOutput"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Person not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        post?: never;
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Deleted person */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: {
                                /** Format: uuid */
                                id: string;
                            };
                            error: unknown;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Person not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["UpdatePersonInput"];
                };
            };
            responses: {
                /** @description Updated person */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["PersonOutput"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Person not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        trace?: never;
    };
    "/person-connections/invitations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Invitations owned by the authenticated user */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["PersonConnectionInvitation"][];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Connection not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Connection state conflict */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["CreatePersonConnectionInvitationInput"];
                };
            };
            responses: {
                /** @description One-time invitation created */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["CreatedPersonConnectionInvitation"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Connection not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Connection state conflict */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/person-connections/invitations/claim": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["ClaimPersonConnectionInvitationInput"];
                };
            };
            responses: {
                /** @description Invitation claimed and confirmation code issued */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["ClaimedPersonConnectionInvitation"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Connection not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Connection state conflict */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/person-connections/invitations/{id}/confirm": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["ConfirmPersonConnectionInput"];
                };
            };
            responses: {
                /** @description Bilateral connection activated */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["PersonConnection"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Connection not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Connection state conflict */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/person-connections/invitations/{id}/cancel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Invitation cancelled */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["PersonConnectionInvitation"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Connection not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Connection state conflict */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/person-connections": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Connections visible to the authenticated user */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["PersonConnection"][];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Connection not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Connection state conflict */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/person-connections/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Connection revoked */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["PersonConnection"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Connection not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Connection state conflict */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/person-reports/{personId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query: {
                    period: string;
                };
                header?: never;
                path: {
                    personId: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Get the monthly expense report of an external person */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["PersonReportOutput"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid period or person is not external */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Person not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/person-reports/{personId}/document": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query: {
                    period: string;
                };
                header?: never;
                path: {
                    personId: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Get the emailed statement as a printable page, to save as PDF */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["PersonReportDocumentOutput"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid period or person is not external */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Person not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/person-reports/{personId}/deliveries": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    personId: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description List the latest email deliveries of a person's report */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["PersonReportDeliveriesOutput"];
                            error: unknown;
                        };
                    };
                };
                /** @description Person is not external */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Person not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    personId: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["CreatePersonReportDeliveryInput"];
                };
            };
            responses: {
                /** @description Email the monthly report to the person */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["PersonReportDeliveryOutput"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid input, or the person cannot receive the report */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Person not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Too many deliveries */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Email delivery is not configured or failed */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/person-reports/{personId}/schedule": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    personId: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Get the automatic email schedule of a person's report */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["PersonReportScheduleStateOutput"];
                            error: unknown;
                        };
                    };
                };
                /** @description Person is not external */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Person not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    personId: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["UpdatePersonReportScheduleInput"];
                };
            };
            responses: {
                /** @description Save the automatic email schedule of a person's report */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["PersonReportScheduleStateOutput"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid schedule, or the person cannot receive the report */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Person not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Too many changes */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Email delivery is not configured */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/person-settlements": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query: {
                    period: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description List outstanding settlement balances by person */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["PersonSettlementsSummaryOutput"];
                            error: unknown;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["CreatePersonSettlementInput"];
                };
            };
            responses: {
                /** @description Register a settlement */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["PersonSettlementOutput"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid settlement */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Person not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/person-settlements/people/{personId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query: {
                    period: string;
                };
                header?: never;
                path: {
                    personId: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Get a person's settlement snapshot */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["PersonSettlementSnapshotOutput"];
                            error: unknown;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Person not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/person-settlements/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Delete a settlement */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: {
                                /** Format: uuid */
                                id: string;
                            };
                            error: unknown;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Settlement not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/external-expenses": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    view?: "pending" | "imported" | "ignored";
                    period?: string;
                    q?: string;
                    sort?: "recent" | "oldest" | "amountDesc" | "amountAsc" | "name";
                    page?: number;
                    pageSize?: number;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Paginated external expenses */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["ExternalExpensePage"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description External expense not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description External expense state conflict */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/external-expenses/summary": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description External expense pending summary */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["ExternalExpenseSummary"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description External expense not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description External expense state conflict */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/external-expenses/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description External expense */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["ExternalExpense"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description External expense not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description External expense state conflict */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/external-expenses/{id}/import": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["ImportExternalExpenseInput"];
                };
            };
            responses: {
                /** @description External expense imported as a regular transaction */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["ImportExternalExpenseOutput"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description External expense not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description External expense state conflict */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/external-expenses/{id}/ignore": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["ReviewExternalExpenseInput"];
                };
            };
            responses: {
                /** @description External expense */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["ExternalExpense"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description External expense not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description External expense state conflict */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/external-expenses/{id}/restore": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["ReviewExternalExpenseInput"];
                };
            };
            responses: {
                /** @description External expense */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["ExternalExpense"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description External expense not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description External expense state conflict */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/notes": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    status?: "active" | "archived" | "all";
                    kind?: "text" | "checklist" | "task";
                    q?: string;
                    limit?: number;
                    offset?: number | null;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Paginated notes */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["NotesPage"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid note request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["CreateNoteInput"];
                };
            };
            responses: {
                /** @description Created note */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["Note"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid note request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/notes/{id}/completion": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["SetTaskCompletionInput"];
                };
            };
            responses: {
                /** @description Updated task completion */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["Note"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid note request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Note or checklist item not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description The note changed after it was opened */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        trace?: never;
    };
    "/notes/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Note details */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["Note"];
                            error: unknown;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Note or checklist item not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["ReplaceNoteInput"];
                };
            };
            responses: {
                /** @description Replaced note */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["Note"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid note request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Note or checklist item not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description The note changed after it was opened */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        post?: never;
        delete: {
            parameters: {
                query: {
                    expectedVersion: number;
                };
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Deleted note */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: {
                                /** Format: uuid */
                                id: string;
                            };
                            error: unknown;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Note or checklist item not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description The note changed after it was opened */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/notes/{id}/archive": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["ArchiveNoteInput"];
                };
            };
            responses: {
                /** @description Archived or restored note */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["Note"];
                            error: unknown;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Note or checklist item not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description The note changed after it was opened */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        trace?: never;
    };
    "/notes/{noteId}/items/{itemId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    noteId: string;
                    itemId: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["SetNoteItemCompletionInput"];
                };
            };
            responses: {
                /** @description Updated checklist item */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["Note"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid note request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Note or checklist item not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description The note changed after it was opened */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        trace?: never;
    };
    "/recurring-transactions/report": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query: {
                    period: string;
                    type?: "expense" | "income";
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Recurring income or expenses, grouped by series, with monthly occurrence projections */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["RecurringTransactionsReport"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid report filters */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/recurring-expenses/report": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query: {
                    period: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Recurring expenses report for the administrator person */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["RecurringExpensesReport"];
                            error: unknown;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/recurring-expenses": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query: {
                    period: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Recurring expenses in the selected dashboard period */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["RecurringExpenses"];
                            error: unknown;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/recurring-expenses/{id}/occurrences/{purchaseDate}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                    purchaseDate: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["UpdateRecurringExpenseInput"];
                };
            };
            responses: {
                /** @description Updated recurring expense occurrence */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["RecurringExpenseAction"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid occurrence */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Recurring expense not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        trace?: never;
    };
    "/recurring-expenses/{id}/occurrences/{purchaseDate}/pause": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                    purchaseDate: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description pause recurring expense occurrence */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["RecurringExpenseAction"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid occurrence */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Recurring expense not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/recurring-expenses/{id}/occurrences/{purchaseDate}/resume": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                    purchaseDate: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description resume recurring expense occurrence */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["RecurringExpenseAction"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid occurrence */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Recurring expense not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/recurring-expenses/{id}/occurrences/{purchaseDate}/skip": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                    purchaseDate: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description skip recurring expense occurrence */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["RecurringExpenseAction"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid occurrence */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Recurring expense not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/recurring-expenses/{id}/occurrences/{purchaseDate}/stop": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                    purchaseDate: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description stop recurring expense occurrence */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["RecurringExpenseAction"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid occurrence */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Recurring expense not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/transactions/export": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query: {
                    period?: string;
                    q?: string;
                    type?: "income" | "expense" | "transfer";
                    condition?: "single" | "installment" | "recurring";
                    paymentMethod?: "credit_card" | "debit_card" | "pix" | "cash" | "boleto" | "benefits" | "bank_transfer";
                    settlement?: "paid" | "unpaid" | "invoice";
                    view?: "accountStatement";
                    payables?: "true";
                    sort?: "recent" | "oldest" | "dueDate" | "amount";
                    personIds?: string;
                    categoryIds?: string;
                    tagIds?: string;
                    withoutTags?: "true";
                    accountIds?: string;
                    cardIds?: string;
                    minAmount?: number | null;
                    maxAmount?: number | null;
                    dateStart?: string;
                    dateEnd?: string;
                    hasAttachments?: "true";
                    isDivided?: "true";
                    page?: number;
                    pageSize?: number;
                    format: "csv" | "xlsx";
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Export all matching transactions, preserving filters and sort order */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["TransactionExport"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid export filters or format */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/transactions/installments/preview": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query: {
                    amount: number;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Installment options with cent redistribution calculated by the domain */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["InstallmentOptionsOutput"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid amount */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/transactions/recurrence-end-date": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query: {
                    startDate: string;
                    anchorDate?: string;
                    dueDate?: string;
                    frequency: "weekly" | "monthly" | "bimonthly" | "quarterly" | "semiannual" | "annual";
                    occurrenceCount: number;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Inclusive recurrence end date that keeps the requested number of occurrences, calculated by the domain */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["RecurrenceEndDateOutput"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid start date, frequency or occurrence count */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/transactions/establishments/recent": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description List unique establishments used in expenses during the last two months */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["RecentEstablishmentsResponse"];
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/transactions/{id}/refunds": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["CreateTransactionRefundInput"];
                };
            };
            responses: {
                /** @description Refund linked to its source expense */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["TransactionRefund"];
                            error: unknown;
                        };
                    };
                };
                /** @description Transaction is not refundable or amount is invalid */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Transaction not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Transaction changed during refund */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/transactions/imports/template": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Spreadsheet template for transaction imports */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: {
                                fileName: string;
                                contentBase64: string;
                            };
                            error: unknown;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/transactions/imports/preview": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["PreviewTransactionImportInput"];
                };
            };
            responses: {
                /** @description Parsed statement ready for review */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["TransactionImportPreview"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid statement */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/transactions/imports": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["ImportTransactionsInput"];
                };
            };
            responses: {
                /** @description Imported statement transactions */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["TransactionImportResult"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid import */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Linked resource not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/transactions/imports/{batchId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    batchId: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Undid a transaction import batch */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: {
                                /** Format: uuid */
                                batchId: string;
                                deleted: number;
                            };
                            error: unknown;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Import batch not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/transactions/recurring-occurrences/settlement": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        /** Format: uuid */
                        recurringRuleId: string;
                        /** Format: date */
                        purchaseDate: string;
                        isSettled: boolean;
                        /** Format: date */
                        settledDate?: string;
                        settledAmount?: number;
                        /** Format: uuid */
                        accountId?: string;
                    };
                };
            };
            responses: {
                /** @description Settled recurring occurrence */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: {
                                /** Format: uuid */
                                recurringRuleId: string;
                                /** Format: date */
                                purchaseDate: string;
                                isSettled: boolean;
                                /** Format: date */
                                settledDate?: string;
                                settledAmount?: number;
                                /** Format: uuid */
                                accountId?: string;
                            };
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Recurring rule not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        trace?: never;
    };
    "/transactions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    period?: string;
                    q?: string;
                    type?: "income" | "expense" | "transfer";
                    condition?: "single" | "installment" | "recurring";
                    paymentMethod?: "credit_card" | "debit_card" | "pix" | "cash" | "boleto" | "benefits" | "bank_transfer";
                    settlement?: "paid" | "unpaid" | "invoice";
                    view?: "accountStatement";
                    payables?: "true";
                    sort?: "recent" | "oldest" | "dueDate" | "amount";
                    personIds?: string;
                    categoryIds?: string;
                    tagIds?: string;
                    withoutTags?: "true";
                    accountIds?: string;
                    cardIds?: string;
                    minAmount?: number | null;
                    maxAmount?: number | null;
                    dateStart?: string;
                    dateEnd?: string;
                    hasAttachments?: "true";
                    isDivided?: "true";
                    page?: number;
                    pageSize?: number;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description List transactions with filters and pagination */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["TransactionsResponse"];
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["CreateTransaction"];
                };
            };
            responses: {
                /** @description Created transaction */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["TransactionResponse"];
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Linked resource not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/transactions/recurring-rules/{id}/copy": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Copied recurring rule */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["TransactionResponse"];
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Recurring rule not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/transactions/recurring-rules/{id}/occurrence": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query: {
                    occurrenceDate: string;
                };
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Recurring occurrence with full editable fields */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["TransactionResponse"];
                    };
                };
                /** @description Invalid recurring occurrence */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Recurring rule not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/transactions/recurring-rules/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put: {
            parameters: {
                query?: {
                    scope?: "single" | "future" | "series";
                    occurrenceDate?: string;
                };
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["CreateTransaction"];
                };
            };
            responses: {
                /** @description Updated recurring rule */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["TransactionResponse"];
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Recurring rule not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Recurring rule changed during editing */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/transactions/settlement": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        ids: string[];
                        isSettled: boolean;
                        /** Format: date */
                        settledDate?: string;
                        settledAmount?: number;
                        /** Format: uuid */
                        accountId?: string;
                    };
                };
            };
            responses: {
                /** @description Settled transactions */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: {
                                ids: string[];
                                isSettled: boolean;
                            };
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Transaction not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        trace?: never;
    };
    "/transactions/bulk/category": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["BulkCategorizeTransactionsInput"];
                };
            };
            responses: {
                /** @description Categorized transactions */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["BulkTransactionsResponse"];
                    };
                };
                /** @description Action is not supported for every selected transaction */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Transaction, category or tag not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        trace?: never;
    };
    "/transactions/bulk/names": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["BulkRenameTransactionsInput"];
                };
            };
            responses: {
                /** @description Renamed transactions */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["BulkTransactionsResponse"];
                    };
                };
                /** @description Action is not supported for every selected transaction */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Transaction, category or tag not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        trace?: never;
    };
    "/transactions/bulk/tags": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["BulkTagTransactionsInput"];
                };
            };
            responses: {
                /** @description Tagged transactions */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["BulkTransactionsResponse"];
                    };
                };
                /** @description Action is not supported for every selected transaction */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Transaction, category or tag not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        trace?: never;
    };
    "/transactions/bulk/delete": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["BulkDeleteTransactionsInput"];
                };
            };
            responses: {
                /** @description Deleted transactions */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["BulkTransactionsResponse"];
                    };
                };
                /** @description Action is not supported for every selected transaction */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Transaction, category or tag not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/transactions/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Get transaction by id */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["TransactionResponse"];
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Transaction not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        /**
                         * @default single
                         * @enum {string}
                         */
                        scope?: "single" | "future" | "series";
                    };
                };
            };
            responses: {
                /** @description Delete transaction */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["DeleteTransactionResponse"];
                    };
                };
                /** @description Transaction must be removed through its owning workflow */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Transaction not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch: {
            parameters: {
                query?: {
                    scope?: "single" | "future" | "series";
                };
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["UpdateTransaction"];
                };
            };
            responses: {
                /** @description Update transaction */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["TransactionResponse"];
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Transaction not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        trace?: never;
    };
    "/transactions/{id}/copy": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Copied transaction */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["TransactionResponse"];
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Transaction not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/transactions/recurring-rules/{id}/status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        /** @enum {string} */
                        status: "active" | "paused" | "cancelled";
                        /** Format: date */
                        occurrenceDate?: string;
                    };
                };
            };
            responses: {
                /** @description Updated recurring rule */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: {
                                /** Format: uuid */
                                id: string;
                                /** @enum {string} */
                                status: "active" | "paused" | "cancelled";
                            };
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Recurring rule not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        trace?: never;
    };
    "/transactions/recurring-rules/{id}/actions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["RecurringOccurrenceActionInput"];
                };
            };
            responses: {
                /** @description Applied recurring action, preserving earlier occurrences */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["RecurringOccurrenceActionInput"] & {
                                /** Format: uuid */
                                id: string;
                            };
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid action or occurrence */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Recurring rule not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/dashboard/snapshot": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query: {
                    period: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Complete dashboard snapshot for a monthly period */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["DashboardSnapshot"];
                            error: unknown;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/dashboard/attention": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query: {
                    period: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Items that need the user's action, ordered by urgency */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["DashboardAttention"];
                            error: unknown;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/dashboard/preferences": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Current dashboard widget preferences */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["DashboardWidgetPreferences"];
                            error: unknown;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["DashboardWidgetPreferencesInput"];
                };
            };
            responses: {
                /** @description Dashboard widget preferences updated */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["DashboardWidgetPreferences"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid dashboard preferences */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        post?: never;
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Dashboard widget preferences reset */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["DashboardWidgetPreferences"];
                            error: unknown;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/dashboard/people-expenses": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query: {
                    period: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Expense totals grouped by person for a monthly period */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["DashboardPeopleExpenses"];
                            error: unknown;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/dashboard/category-breakdown": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query: {
                    period: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Income and expense totals grouped by category for a monthly period */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["DashboardCategoryBreakdown"];
                            error: unknown;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/dashboard": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query: {
                    period: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Dashboard metrics for a monthly period */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["DashboardMetrics"];
                            error: unknown;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/dashboard/expense-distribution": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query: {
                    period: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Expense distribution by condition and payment method */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["DashboardExpenseDistribution"];
                            error: unknown;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/dashboard/payment-status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query: {
                    period: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Confirmed and pending dashboard amounts for a monthly period */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["DashboardPaymentStatus"];
                            error: unknown;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/dashboard/accounts": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query: {
                    period: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Account balances for the dashboard period */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["DashboardAccounts"];
                            error: unknown;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ai-providers": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description AI provider connections */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["AiProviders"];
                            error: unknown;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ai-providers/{provider}/logins": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    provider: "claude" | "codex" | "antigravity";
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["StartAiProviderLoginInput"];
                };
            };
            responses: {
                /** @description Started provider sign-in */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["AiProviderLogin"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid AI provider request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description AI features are disabled or the AI service is unavailable */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ai-providers/{provider}/logins/{loginId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    provider: "claude" | "codex" | "antigravity";
                    loginId: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Provider sign-in status */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["AiProviderLogin"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid AI provider request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Sign-in not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description AI features are disabled or the AI service is unavailable */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ai-providers/{provider}/logins/{loginId}/code": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    provider: "claude" | "codex" | "antigravity";
                    loginId: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["SubmitAiProviderLoginCodeInput"];
                };
            };
            responses: {
                /** @description Provider sign-in status after the code was handed to the CLI */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["AiProviderLogin"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid AI provider request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Sign-in not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description AI features are disabled or the AI service is unavailable */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ai-providers/{provider}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    provider: "claude" | "codex" | "antigravity";
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Disconnected provider */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["AiProvider"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid AI provider request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description AI features are disabled or the AI service is unavailable */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    provider: "claude" | "codex" | "antigravity";
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["UpdateAiProviderInput"];
                };
            };
            responses: {
                /** @description Updated provider preferences */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["AiProvider"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid AI provider request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Provider not connected */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description AI features are disabled or the AI service is unavailable */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        trace?: never;
    };
    "/ai-tools": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description The AI service's CLI builds, for the installation admin */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["AiTools"];
                            error: unknown;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description AI service unavailable */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ai-tools/events": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Every change to the CLI builds, newest first */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["AiToolEvents"];
                            error: unknown;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Only the installation admin manages AI tools */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description AI service unavailable */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ai-tools/{provider}/installs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    provider: "claude" | "codex" | "antigravity";
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["InstallAiToolInput"];
                };
            };
            responses: {
                /** @description Install started, or refused with its reason */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["AiToolJob"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid version */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Only the installation admin manages AI tools */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description AI service unavailable */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ai-tools/{provider}/installs/{jobId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    provider: "claude" | "codex" | "antigravity";
                    jobId: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Progress of an install */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["AiToolJob"];
                            error: unknown;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Only the installation admin manages AI tools */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Install not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description AI service unavailable */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ai-tools/{provider}/active": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    provider: "claude" | "codex" | "antigravity";
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["ActivateAiToolInput"];
                };
            };
            responses: {
                /** @description The build the provider now runs */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["AiTool"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid version */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Only the installation admin manages AI tools */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Version not installed or an install is running */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description AI service unavailable */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ai-chats": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Recent chats */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["AiChats"];
                            error: unknown;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["CreateAiChatInput"];
                };
            };
            responses: {
                /** @description New chat */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["AiChat"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid chat request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Chat not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Provider not connected, a reply in progress or daily limit reached */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description AI service unavailable */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ai-chats/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Chat with its messages */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["AiChat"];
                            error: unknown;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Chat not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Deleted chat and its messages */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: {
                                /** Format: uuid */
                                id: string;
                            };
                            error: unknown;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Chat not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["UpdateAiChatInput"];
                };
            };
            responses: {
                /** @description Renamed chat */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["AiChatSummary"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid chat request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Chat not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        trace?: never;
    };
    "/ai-chats/{id}/messages": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["SendAiChatMessageInput"];
                };
            };
            responses: {
                /** @description Server-sent events: `start`, then `reasoning` and `delta` while the reply is written, then `done` with the saved message. Closing the connection stops the reply. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "text/event-stream": components["schemas"]["AiChatStreamEvent"];
                    };
                };
                /** @description Invalid chat request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Chat not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Provider not connected, a reply in progress or daily limit reached */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description AI service unavailable */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ai-chats/{id}/regenerate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["RegenerateAiChatReplyInput"];
                };
            };
            responses: {
                /** @description Server-sent events: `start`, then `reasoning` and `delta` while the reply is written, then `done` with the saved message. Closing the connection stops the reply. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "text/event-stream": components["schemas"]["AiChatStreamEvent"];
                    };
                };
                /** @description Invalid chat request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Chat not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Provider not connected, a reply in progress or daily limit reached */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description AI service unavailable */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ai-data-sharing": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Data the AI diagnosis may send beyond aggregates */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["AiDataSharing"];
                            error: unknown;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["UpdateAiDataSharingInput"];
                };
            };
            responses: {
                /** @description Saved permissions */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["AiDataSharing"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid permissions */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ai-data-sharing/preview": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query: {
                    period: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description The financial data an AI diagnosis or chat of the period would send */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["AiDataPreview"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid period */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ai-data-sharing/retention": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["UpdateAiDataRetentionInput"];
                };
            };
            responses: {
                /** @description Saved retention of AI chats and diagnoses */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["AiDataSharing"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid retention */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ai-data-sharing/history": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Every AI chat and diagnosis of the user was deleted */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["AiDataHistoryDeleted"];
                            error: unknown;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ai-diagnoses": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Recent financial health diagnoses */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["AiDiagnoses"];
                            error: unknown;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["CreateAiDiagnosisInput"];
                };
            };
            responses: {
                /** @description Diagnosis accepted; poll it until it is completed or failed */
                202: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["AiDiagnosis"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid diagnosis request or no data to diagnose */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Provider not connected, diagnosis in progress or daily limit reached */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description AI service unavailable */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ai-diagnoses/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Diagnosis details */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["AiDiagnosis"];
                            error: unknown;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Diagnosis not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Deleted diagnosis; a running one is stopped first */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: {
                                /** Format: uuid */
                                id: string;
                            };
                            error: unknown;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Diagnosis not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ai-diagnoses/{id}/cancel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Stopped diagnosis, now failed with the canceled code */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["AiDiagnosis"];
                            error: unknown;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Diagnosis not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description The diagnosis is no longer running */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/invoices/{cardId}/{period}/dates": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    cardId: string;
                    period: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["UpdateInvoiceDatesInput"];
                };
            };
            responses: {
                /** @description Invoice effective dates updated */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["UpdateInvoiceDatesInput"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid invoice dates */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Card not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        trace?: never;
    };
    "/invoices/{cardId}/{period}/reopen": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    cardId: string;
                    period: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Invoice reopened and all payments reversed */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: {
                                reversedPaymentCount: number;
                                reversedAmount: number;
                            };
                            error: unknown;
                        };
                    };
                };
                /** @description Card not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/invoices/{cardId}/{period}/adjustments/{adjustmentId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    cardId: string;
                    period: string;
                    adjustmentId: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Invoice adjustment removed */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: {
                                /** Format: uuid */
                                id: string;
                            };
                            error: unknown;
                        };
                    };
                };
                /** @description Invoice adjustment not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Invoice must be reopened before removing an adjustment */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/invoices/{cardId}/{period}/adjustments": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    cardId: string;
                    period: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["AdjustInvoiceInput"];
                };
            };
            responses: {
                /** @description Invoice amount adjusted */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: {
                                /** Format: uuid */
                                id: string | null;
                                previousAmount: number;
                                currentAmount: number;
                                adjustmentAmount: number;
                                /** @enum {string|null} */
                                type: "expense" | null;
                            };
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid invoice adjustment */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Invoice adjustment dependency not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Invoice must be reopened before adjustment */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/invoices": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query: {
                    period: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Invoice dashboard snapshot */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["DashboardInvoices"];
                            error: unknown;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/invoices/{cardId}/{period}/payments": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    cardId: string;
                    period: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["CreateInvoicePaymentInput"];
                };
            };
            responses: {
                /** @description Invoice payment created */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: {
                                /** Format: uuid */
                                id: string;
                                amount: number;
                                accountAmount: number;
                                remainingAmount: number;
                                /** @enum {string} */
                                status: "open" | "closed" | "overdue" | "paid";
                            };
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid payment */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Invoice not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Invoice changed during payment */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/invoices/{cardId}/{period}/payments/{paymentId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    cardId: string;
                    period: string;
                    paymentId: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Invoice payment undone */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: {
                                /** Format: uuid */
                                id: string;
                                amount: number;
                            };
                            error: unknown;
                        };
                    };
                };
                /** @description Invoice payment not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/establishments/logo": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query: {
                    name: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description User logo mapping */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: {
                                nameKey: string;
                                domain: string | null;
                                logoUrl: string | null;
                                enabled: boolean;
                            };
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        name: string;
                        domain: string;
                    };
                };
            };
            responses: {
                /** @description Saved logo mapping */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: {
                                nameKey: string;
                                domain: string | null;
                                logoUrl: string | null;
                                enabled: boolean;
                            };
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        post?: never;
        delete: {
            parameters: {
                query: {
                    name: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Removed logo mapping */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: {
                                nameKey: string;
                                domain: string | null;
                                logoUrl: string | null;
                                enabled: boolean;
                            };
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/establishments/logo/search": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query: {
                    q: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Logo.dev brand matches */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: {
                                name: string;
                                domain: string;
                                logoUrl: string;
                            }[];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Logo.dev unavailable */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/attachments": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query: {
                    period: string;
                    q?: string;
                    kind?: "image" | "pdf";
                    personId?: string;
                    page?: number;
                    pageSize?: number;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Attachments for a period */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["PaginatedAttachments"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/attachments/prepare": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["PrepareAttachmentInput"];
                };
            };
            responses: {
                /** @description Prepared upload */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["PreparedAttachment"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Attachment storage unavailable */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/attachments/confirm": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["ConfirmAttachmentInput"];
                };
            };
            responses: {
                /** @description Confirmed attachment */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["Attachment"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Attachment storage unavailable */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/attachments/transaction/{transactionId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    transactionId: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Transaction attachments */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["Attachment"][];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/attachments/transaction/{transactionId}/{attachmentId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    transactionId: string;
                    attachmentId: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Detached transaction attachment */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: {
                                /** Format: uuid */
                                id: string;
                                /** Format: uuid */
                                transactionId: string;
                                deleted: boolean;
                            };
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/attachments/{id}/download-url": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    disposition?: "inline" | "attachment";
                };
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Short-lived attachment URL */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["AttachmentUrl"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Attachment storage unavailable */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/attachments/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Deleted attachment from every linked transaction */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: {
                                /** Format: uuid */
                                id: string;
                            };
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/reports/financial-distribution": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query: {
                    period: string;
                    personScope?: ("admin" | "all") | string;
                    mode?: "actual" | "forecast";
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Monthly financial distribution by category */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["FinancialDistribution"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid report period or person filter */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/reports/category-trends": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query: {
                    startPeriod: string;
                    endPeriod: string;
                    categoryIds?: string;
                    personScope?: ("admin" | "all") | string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Category trends over a monthly period range */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["CategoryTrends"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid report period or category filter */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/reports/commitments": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query: {
                    startPeriod: string;
                    endPeriod: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Monthly commitments from installments, recurring series and launched bills */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["Commitments"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid report period range */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/reports/installments/dashboard": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query: {
                    period: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Installment expenses in the dashboard period */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["DashboardInstallmentExpenses"];
                            error: unknown;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/reports/installments": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query: {
                    period: string;
                    status?: "open" | "completed" | "all";
                    q?: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Installment series report for a reference period */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["InstallmentsReport"];
                            error: unknown;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/reports/installments/quote": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["QuoteInstallmentsInput"];
                };
            };
            responses: {
                /** @description Total for a selection of pending installments */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["InstallmentQuote"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid installment selection */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/reports/installments/{seriesId}/anticipations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    seriesId: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["CreateInstallmentAnticipationInput"];
                };
            };
            responses: {
                /** @description Future installments moved into an earlier credit card invoice */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["InstallmentAnticipation"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid or ineligible installment selection */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Installments changed during anticipation */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/reports/installments/{seriesId}/anticipations/{anticipationId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    seriesId: string;
                    anticipationId: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Anticipation details and its current installments */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["InstallmentAnticipationDetails"];
                            error: unknown;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Anticipation not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    seriesId: string;
                    anticipationId: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["UndoInstallmentAnticipationInput"];
                };
            };
            responses: {
                /** @description Selected anticipated installments restored to their original invoices */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["UndoInstallmentAnticipation"];
                            error: unknown;
                        };
                    };
                };
                /** @description Anticipation cannot be undone */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Anticipation not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        trace?: never;
    };
    "/settings/security": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Security settings */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["SettingsSecurityOutput"];
                            error: unknown;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/settings/reset": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["ResetSettingsInput"];
                };
            };
            responses: {
                /** @description Application data reset */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["ResetSettingsOutput"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid confirmation */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description User not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Too many requests */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Attachment storage unavailable */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/settings/account": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["DeleteSettingsAccountInput"];
                };
            };
            responses: {
                /** @description Account deleted */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["DeleteSettingsAccountOutput"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid confirmation */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description User not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Too many requests */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Attachment storage unavailable */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/preferences/defaults": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Current user preferences */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["UserPreferencesOutput"];
                            error: unknown;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/preferences": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Current user preferences */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["UserPreferencesOutput"];
                            error: unknown;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Current user preferences */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["UserPreferencesOutput"];
                            error: unknown;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["UpdateUserPreferencesInput"];
                };
            };
            responses: {
                /** @description Current user preferences */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["UserPreferencesOutput"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid or unavailable preference */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        trace?: never;
    };
    "/due-date-rules": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Due date rules */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["DueDateRulesOutput"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid rules */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Rules changed */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["SaveDueDateRulesInput"];
                };
            };
            responses: {
                /** @description Due date rules */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["DueDateRulesOutput"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid rules */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Rules changed */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/due-date-rules/options": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Due date rules */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: {
                                cards: {
                                    /** Format: uuid */
                                    id: string;
                                    name: string;
                                }[];
                                payables: {
                                    /** Format: uuid */
                                    id: string;
                                    name: string;
                                    /** @enum {string} */
                                    kind: "transaction" | "series";
                                }[];
                            };
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid rules */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Rules changed */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/due-date-rules/holidays": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query: {
                    year: number;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Due date rules */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: {
                                year: number;
                                items: {
                                    /** @enum {string} */
                                    id: "newYear" | "tiradentes" | "labourDay" | "independenceDay" | "ourLadyOfAparecida" | "allSoulsDay" | "republicProclamation" | "blackAwarenessDay" | "christmas";
                                    /** Format: date */
                                    date: string;
                                }[];
                            };
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid rules */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Rules changed */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/due-date-rules/exception": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        /** @enum {string} */
                        target: "transaction";
                        /** Format: uuid */
                        transactionId: string;
                        excluded: boolean;
                    } | {
                        /** @enum {string} */
                        target: "recurring";
                        /** Format: uuid */
                        recurringRuleId: string;
                        /** Format: date */
                        occurrenceDate: string;
                        excluded: boolean;
                    } | {
                        /** @enum {string} */
                        target: "invoice";
                        /** Format: uuid */
                        cardId: string;
                        period: string;
                        excluded: boolean;
                    };
                };
            };
            responses: {
                /** @description Due date rules */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: {
                                excluded: boolean;
                            };
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid rules */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Due date target not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Rules changed */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        trace?: never;
    };
    "/due-date-rules/preview": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["SaveDueDateRulesInput"];
                };
            };
            responses: {
                /** @description Due date rules */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: {
                                items: {
                                    id: string;
                                    name: string;
                                    /** @enum {string} */
                                    target: "payable" | "invoice";
                                    /** Format: date */
                                    originalDueDate: string;
                                    /** Format: date */
                                    currentDueDate: string;
                                    /** Format: date */
                                    dueDate: string;
                                    ruleName: string | null;
                                }[];
                                /** Format: date */
                                from: string;
                                /** Format: date */
                                through: string;
                            };
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid rules */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Rules changed */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/device-tokens": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Active Companion tokens */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["DeviceToken"][];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Token not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["CreateDeviceTokenInput"];
                };
            };
            responses: {
                /** @description Device token created; the secret is returned only once */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["CreatedDeviceToken"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Token not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/device-tokens/{id}/rotate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Device token replaced; the previous token stops working and the new secret is returned only once */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["CreatedDeviceToken"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Token not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/device-tokens/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Device token revoked */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: {
                                /** Format: uuid */
                                id: string;
                            };
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Token not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/inbox": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    status?: "pending" | "processed" | "discarded";
                    sourceAppName?: string;
                    notificationDate?: string;
                    ruleId?: string;
                    page?: number;
                    pageSize?: number;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Paginated inbox items */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["InboxPage"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Inbox item not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Inbox state conflict */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete: {
            parameters: {
                query: {
                    status: "processed" | "discarded";
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Delete all processed or discarded inbox items */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["ClearInboxItemsOutput"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/inbox/snapshot": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    limit?: number;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Pending inbox dashboard snapshot */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["InboxSnapshot"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Inbox item not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Inbox state conflict */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/inbox/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Inbox item details including the original notification */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["InboxItem"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Inbox item not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Inbox state conflict */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Delete a processed or discarded inbox item */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: {
                                /** Format: uuid */
                                id: string;
                            };
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Inbox item not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Inbox state conflict */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/inbox/discard": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["DiscardInboxItemsInput"];
                };
            };
            responses: {
                /** @description Discard several pending inbox items at once */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["DiscardInboxItemsOutput"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Inbox item not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Inbox state conflict */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/inbox/{id}/discard": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description discard inbox item */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["InboxItemSummary"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Inbox item not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Inbox state conflict */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/inbox/{id}/restore": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description restore inbox item */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["InboxItemSummary"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Inbox item not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Inbox state conflict */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/inbox/{id}/confirm": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["CreateTransaction"];
                };
            };
            responses: {
                /** @description Create a transaction and process the inbox item atomically */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["Transaction"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Inbox item not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Inbox state conflict */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/inbox/{id}/process": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["ProcessInboxItemInput"];
                };
            };
            responses: {
                /** @description Link an owned transaction and mark the inbox item as processed */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["InboxItemSummary"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Inbox item not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Inbox state conflict */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/inbox-rules": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description List inbox rules ordered by priority */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["InboxRulesList"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Inbox rule or item not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Inbox rule conflict */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Too many requests */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["CreateInboxRuleInput"];
                };
            };
            responses: {
                /** @description Created inbox rule */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["InboxRule"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Inbox rule or item not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Inbox rule conflict */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Too many requests */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/inbox-rules/suggestions/{inboxItemId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    inboxItemId: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Resolve rule-based defaults for a pending inbox item */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["InboxRuleSuggestion"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Inbox rule or item not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Inbox rule conflict */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Too many requests */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/inbox-rules/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["ReplaceInboxRuleInput"];
                };
            };
            responses: {
                /** @description Replaced inbox rule */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["InboxRule"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Inbox rule or item not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Inbox rule conflict */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Too many requests */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        post?: never;
        delete: {
            parameters: {
                query: {
                    expectedVersion: number;
                };
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Deleted inbox rule */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: {
                                /** Format: uuid */
                                id: string;
                            };
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Inbox rule or item not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Inbox rule conflict */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Too many requests */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/inbox-rules/{id}/active": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["SetInboxRuleActiveInput"];
                };
            };
            responses: {
                /** @description Changed inbox rule activation */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["InboxRule"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Inbox rule or item not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Inbox rule conflict */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Too many requests */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        trace?: never;
    };
    "/notifications": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Current actionable notifications */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["Notifications"];
                            error: unknown;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/notifications/{notificationKey}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    notificationKey: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["UpdateNotificationStateInput"];
                };
            };
            responses: {
                /** @description Notification state updated */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: {
                                notificationKey: string;
                                isRead: boolean;
                                isArchived: boolean;
                            };
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid notification state */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Notification not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Notification changed */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        trace?: never;
    };
    "/releases": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Application version, release history and update status */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["Releases"];
                            error: unknown;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/releases/{version}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    version: components["schemas"]["SemanticVersion"];
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["MarkReleaseSeenInput"];
                };
            };
            responses: {
                /** @description Current release marked as seen */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: components["schemas"]["MarkReleaseSeenOutput"];
                            error: unknown;
                        };
                    };
                };
                /** @description Invalid release state */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Authentication required */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
                /** @description Release not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            error: true;
                            message: string;
                            code?: string;
                        };
                    };
                };
            };
        };
        trace?: never;
    };
    "/api/inbox": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["CompanionInboxItemInput"];
                };
            };
            responses: {
                /** @description Notification accepted idempotently */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["CompanionInboxAccepted"];
                    };
                };
                /** @description Invalid notification */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["CompanionInboxError"];
                    };
                };
                /** @description Invalid token */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["CompanionDeviceAuthenticationError"];
                    };
                };
                /** @description Idempotency conflict */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["CompanionInboxError"];
                    };
                };
                /** @description Payload too large */
                413: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["CompanionInboxError"];
                    };
                };
                /** @description Too many requests */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["CompanionInboxError"];
                    };
                };
                /** @description Internal error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["CompanionInboxError"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/inbox/batch": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["CompanionInboxBatchInput"];
                };
            };
            responses: {
                /** @description Notification batch accepted idempotently */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["CompanionInboxBatch"];
                    };
                };
                /** @description Invalid notification batch */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["CompanionInboxError"];
                    };
                };
                /** @description Invalid token */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["CompanionDeviceAuthenticationError"];
                    };
                };
                /** @description Payload too large */
                413: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["CompanionInboxError"];
                    };
                };
                /** @description Too many requests */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["CompanionInboxError"];
                    };
                };
                /** @description Internal error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["CompanionInboxError"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/health": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description API health status */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: {
                                /** @enum {string} */
                                status: "ok";
                            };
                            error: unknown;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/health": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Companion-compatible API health status */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {string} */
                            status: "ok";
                            name: string;
                            version: string;
                            /** Format: date-time */
                            timestamp: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        AuthConfig: {
            signupEnabled: boolean;
            googleEnabled: boolean;
        };
        CompanionDeviceVerification: {
            /** @enum {boolean} */
            valid: true;
            /** Format: uuid */
            tokenId: string;
            tokenName: string;
            /** Format: date-time */
            expiresAt: string;
        };
        CompanionDeviceAuthenticationError: {
            /** @enum {boolean} */
            valid: false;
            error: string;
        };
        AccountOutput: {
            /** Format: uuid */
            id: string;
            name: string;
            /** @enum {string} */
            type: "checking" | "savings" | "investment" | "cash" | "benefits" | "other";
            logo: string | null;
            note: string | null;
            excludeFromBalance: boolean;
            isArchived: boolean;
            summary: components["schemas"]["AccountPeriodSummary"];
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        AccountPeriodSummary: {
            period: string;
            openingBalance: number;
            income: number;
            expenses: number;
            netAmount: number;
            balance: number;
        };
        CreateAccountInput: {
            name: string;
            /** @enum {string} */
            type: "checking" | "savings" | "investment" | "cash" | "benefits" | "other";
            logo?: string | null;
            note?: string | null;
            /** @default false */
            excludeFromBalance: boolean;
        };
        AddAccountYieldInput: {
            /** @enum {string} */
            mode: "amount";
            amount: number;
            /** Format: date */
            date: string;
        } | {
            /** @enum {string} */
            mode: "currentBalance";
            balance: number;
            /** Format: date */
            date: string;
        };
        AccountCashFlowOutput: {
            period: string;
            /** Format: date */
            startDate: string;
            /** Format: date */
            endDate: string;
            openingBalance: number;
            outsideMonthAmount: number;
            daily: {
                income: number;
                expenses: number;
                balance: number;
                /** Format: date */
                date: string;
            }[];
            history: {
                endPeriod: string;
                items: {
                    income: number;
                    expenses: number;
                    balance: number;
                    period: string;
                }[];
            };
        };
        ReplaceAccountInput: {
            name: string;
            /** @enum {string} */
            type: "checking" | "savings" | "investment" | "cash" | "benefits" | "other";
            logo?: string | null;
            note?: string | null;
            excludeFromBalance: boolean;
            isArchived: boolean;
        };
        AccountBalanceAdjustmentOutput: {
            account: components["schemas"]["AccountOutput"];
            adjustmentCreated: boolean;
        };
        AdjustAccountBalanceInput: {
            balance: number;
            /** Format: date */
            date: string;
        };
        UpdateAccountInput: {
            name?: string;
            /** @enum {string} */
            type?: "checking" | "savings" | "investment" | "cash" | "benefits" | "other";
            logo?: string | null;
            note?: string | null;
            excludeFromBalance?: boolean;
            isArchived?: boolean;
        };
        AccountBalanceAdjustmentPreview: {
            currentBalance: number;
            desiredBalance: number;
            adjustmentAmount: number;
            /** Format: date */
            date: string;
        };
        CardOutput: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            accountId: string;
            name: string;
            /** @enum {string} */
            brand: "visa" | "mastercard" | "elo" | "amex" | "hipercard" | "other";
            closingDayPurchasesNextInvoice: boolean;
            /** @enum {string} */
            status: "active" | "inactive";
            /** @enum {string} */
            closingRuleType: "fixedDay" | "daysBeforeDue";
            closingDay: number | null;
            closingOffsetDays: number | null;
            /** @enum {string|null} */
            closingOffsetMode: "calendarDays" | "weekdays" | null;
            dueDay: number;
            limit: number;
            logo: string | null;
            note: string | null;
            invoiceSummary: components["schemas"]["CardInvoiceSummary"];
            cycleSpending: {
                /** Format: date */
                startDate: string;
                /** Format: date */
                endDate: string;
                openingAmount: number;
                daily: {
                    /** Format: date */
                    date: string;
                    amount: number;
                    cumulativeAmount: number;
                }[];
            };
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        CardInvoiceSummary: {
            period: string;
            amount: number;
            paidAmount: number;
            remainingAmount: number;
            payments: {
                /** Format: uuid */
                id: string;
                amount: number;
                /** Format: date */
                paidAt: string;
            }[];
            /** @enum {string} */
            status: "open" | "closed" | "overdue" | "paid";
            /** Format: date */
            closingDate: string;
            /** Format: date */
            dueDate: string;
            /** Format: date */
            originalDueDate?: string | null;
            dueDateAdjustment?: {
                /** @enum {string} */
                direction: "next" | "previous";
                ruleName: string | null;
                reasons: {
                    /** Format: date */
                    date: string;
                    /** @enum {string|null} */
                    weekend: "saturday" | "sunday" | null;
                    /** @enum {string|null} */
                    nationalHolidayId: "newYear" | "tiradentes" | "labourDay" | "independenceDay" | "ourLadyOfAparecida" | "allSoulsDay" | "republicProclamation" | "blackAwarenessDay" | "christmas" | null;
                    additionalHoliday: boolean;
                }[];
            } | null;
            dueDateExceptionEditable?: boolean;
            dueDateRuleExcluded?: boolean;
            totalLimit: number;
            usedLimit: number;
            availableLimit: number;
            usagePercentage: number;
        };
        CreateCardInput: {
            /** Format: uuid */
            accountId: string;
            name: string;
            /** @enum {string} */
            brand: "visa" | "mastercard" | "elo" | "amex" | "hipercard" | "other";
            closingDayPurchasesNextInvoice?: boolean;
            /**
             * @default active
             * @enum {string}
             */
            status: "active" | "inactive";
            /**
             * @default fixedDay
             * @enum {string}
             */
            closingRuleType: "fixedDay" | "daysBeforeDue";
            closingDay?: number | null;
            closingOffsetDays?: number | null;
            /** @enum {string|null} */
            closingOffsetMode?: "calendarDays" | "weekdays" | null;
            dueDay: number;
            limit: number;
            logo?: string | null;
            note?: string | null;
        };
        CardInvoicePeriodOutput: {
            period: string;
        };
        CardInvoiceHistoryOutput: {
            items: {
                period: string;
                amount: number;
            }[];
        };
        ReplaceCardInput: {
            /** Format: uuid */
            accountId: string;
            name: string;
            /** @enum {string} */
            brand: "visa" | "mastercard" | "elo" | "amex" | "hipercard" | "other";
            closingDayPurchasesNextInvoice?: boolean;
            /**
             * @default active
             * @enum {string}
             */
            status: "active" | "inactive";
            /**
             * @default fixedDay
             * @enum {string}
             */
            closingRuleType: "fixedDay" | "daysBeforeDue";
            closingDay?: number | null;
            closingOffsetDays?: number | null;
            /** @enum {string|null} */
            closingOffsetMode?: "calendarDays" | "weekdays" | null;
            dueDay: number;
            limit: number;
            logo?: string | null;
            note?: string | null;
        };
        UpdateCardInput: {
            /** Format: uuid */
            accountId?: string;
            name?: string;
            /** @enum {string} */
            brand?: "visa" | "mastercard" | "elo" | "amex" | "hipercard" | "other";
            closingDayPurchasesNextInvoice?: boolean;
            /** @enum {string} */
            status?: "active" | "inactive";
            /** @enum {string} */
            closingRuleType?: "fixedDay" | "daysBeforeDue";
            closingDay?: number | null;
            closingOffsetDays?: number | null;
            /** @enum {string|null} */
            closingOffsetMode?: "calendarDays" | "weekdays" | null;
            dueDay?: number;
            limit?: number;
            logo?: string | null;
            note?: string | null;
        };
        BudgetOverview: {
            period: string;
            allocatedAmount: number;
            actualSpentAmount: number;
            projectedAmount: number;
            committedAmount: number;
            availableAmount: number;
            exceededAmount: number;
            unbudgetedCommittedAmount: number;
            unbudgetedItems: {
                /** Format: uuid */
                categoryId: string | null;
                committedAmount: number;
            }[];
            warningCount: number;
            items: components["schemas"]["Budget"][];
        };
        Budget: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            categoryId: string;
            categoryName: string;
            categoryIcon: string | null;
            period: string;
            amount: number;
            actualSpentAmount: number;
            projectedAmount: number;
            committedAmount: number;
            remainingAmount: number;
            exceededAmount: number;
            usagePercentage: number;
            /** @enum {string} */
            status: "onTrack" | "warning" | "reached" | "exceeded";
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        CreateBudgetInput: {
            /** Format: uuid */
            categoryId: string;
            period: string;
            amount: number;
        };
        CopyPreviousBudgetsOutput: {
            createdCount: number;
            skippedCount: number;
        };
        CopyPreviousBudgetsInput: {
            period: string;
            sourceBudgetIds: string[];
        };
        UpdateBudgetInput: {
            amount?: number;
            period?: string;
        };
        Goal: {
            /** Format: uuid */
            id: string;
            name: string;
            targetAmount: number;
            currentAmount: number;
            remainingAmount: number;
            progressPercentage: number;
            /** Format: date */
            targetDate: string | null;
            /** @enum {string} */
            trackingType: "manual" | "account";
            /** Format: uuid */
            accountId: string | null;
            accountName: string | null;
            accountLogo: string | null;
            /** @enum {string} */
            status: "active" | "paused" | "completed" | "archived";
            /** @enum {string|null} */
            paceStatus: "ahead" | "onTrack" | "behind" | "overdue" | "achieved" | null;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        CreateGoalInput: {
            name: string;
            targetAmount: number;
            currentAmount: number;
            /** Format: date */
            targetDate: string | null;
            /** @enum {string} */
            trackingType: "manual";
        } | {
            name: string;
            targetAmount: number;
            /** Format: date */
            targetDate: string | null;
            /** @enum {string} */
            trackingType: "account";
            /** Format: uuid */
            accountId: string;
        };
        UpdateGoalInput: {
            name?: string;
            targetAmount?: number;
            currentAmount?: number;
            /** Format: date */
            targetDate?: string | null;
            /** @enum {string} */
            status?: "active" | "paused" | "completed" | "archived";
        };
        DashboardBills: {
            period: string;
            totalOpen: number;
            overdueCount: number;
            accounts: {
                /** Format: uuid */
                id: string;
                name: string;
                logo: string | null;
            }[];
            items: {
                id: string;
                /** Format: uuid */
                recordId: string | null;
                /** Format: uuid */
                recurringRuleId: string | null;
                /** Format: uuid */
                recurringSeriesId?: string | null;
                /** Format: date */
                purchaseDate: string;
                period: string;
                name: string;
                /** @enum {string} */
                paymentMethod: "credit_card" | "debit_card" | "pix" | "cash" | "boleto" | "benefits" | "bank_transfer";
                amount: number;
                /** Format: date */
                dueDate: string;
                /** Format: date */
                originalDueDate?: string | null;
                dueDateAdjustment?: {
                    /** @enum {string} */
                    direction: "next" | "previous";
                    ruleName: string | null;
                    reasons: {
                        /** Format: date */
                        date: string;
                        /** @enum {string|null} */
                        weekend: "saturday" | "sunday" | null;
                        /** @enum {string|null} */
                        nationalHolidayId: "newYear" | "tiradentes" | "labourDay" | "independenceDay" | "ourLadyOfAparecida" | "allSoulsDay" | "republicProclamation" | "blackAwarenessDay" | "christmas" | null;
                        additionalHoliday: boolean;
                    }[];
                } | null;
                dueDateExceptionEditable?: boolean;
                dueDateRuleExcluded?: boolean;
                /** Format: date */
                boletoPaymentDate: string | null;
                /** Format: date */
                settledDate: string | null;
                isSettled: boolean;
                /** @enum {string} */
                status: "paid" | "due" | "overdue";
                /** @enum {string} */
                condition: "single" | "installment" | "recurring";
                currentInstallment: number | null;
                installmentCount: number | null;
                /** @enum {string|null} */
                recurrenceFrequency: "weekly" | "monthly" | "bimonthly" | "quarterly" | "semiannual" | "annual" | null;
                /** Format: uuid */
                accountId: string | null;
                accountName: string | null;
                accountLogo: string | null;
                categoryName: string | null;
                categoryIcon: string | null;
                people: {
                    /** Format: uuid */
                    personId: string;
                    personName: string;
                    personAvatarUrl: string | null;
                    amount: number;
                }[];
            }[];
        };
        CreateBillPaymentInput: {
            billId: string;
            /** Format: uuid */
            accountId: string;
            /** Format: date */
            paidAt: string;
            amount?: number;
        };
        CategoryOutput: {
            /** Format: uuid */
            id: string;
            name: string;
            /** @enum {string} */
            type: "income" | "expense";
            icon: string | null;
            isSystem: boolean;
            /** Format: uuid */
            parentId?: string | null;
            parentName?: string | null;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        CreateCategoryInput: {
            name: string;
            /** @enum {string} */
            type: "income" | "expense";
            icon?: string | null;
            /** Format: uuid */
            parentId?: string | null;
        };
        ReplaceCategoryInput: {
            name: string;
            /** @enum {string} */
            type: "income" | "expense";
            icon?: string | null;
            /** Format: uuid */
            parentId?: string | null;
        };
        UpdateCategoryInput: {
            name?: string;
            /** @enum {string} */
            type?: "income" | "expense";
            icon?: string | null;
            /** Format: uuid */
            parentId?: string | null;
        };
        TagOutput: {
            /** Format: uuid */
            id: string;
            name: string;
            /** @enum {string} */
            status: "active" | "inactive";
            /** @enum {string} */
            color: "neutral" | "orange" | "blue" | "green" | "purple" | "yellow" | "red";
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        TagsReport: {
            period: string;
            items: {
                /** Format: uuid */
                tagId: string;
                income: number;
                expenses: number;
                /** @description Total transferred between accounts, counting each outgoing posting once without affecting balance */
                transfers: number;
                balance: number;
                /** @description Transactions with this tag in the period, counting each transfer once */
                transactionCount: number;
            }[];
        };
        CreateTagInput: {
            name: string;
            /**
             * @default neutral
             * @enum {string}
             */
            color: "neutral" | "orange" | "blue" | "green" | "purple" | "yellow" | "red";
        };
        UpdateTagInput: {
            name?: string;
            /** @enum {string} */
            color?: "neutral" | "orange" | "blue" | "green" | "purple" | "yellow" | "red";
            /** @enum {string} */
            status?: "active" | "inactive";
        };
        PersonOutput: {
            /** Format: uuid */
            id: string;
            name: string;
            /** Format: email */
            email: string | null;
            avatarUrl: string | null;
            providerAvatarUrl: string | null;
            /** @enum {string} */
            role: "admin" | "external";
            /** @enum {string} */
            status: "active" | "inactive";
            note: string | null;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        CreatePersonInput: {
            name: string;
            /** Format: email */
            email?: string | null;
            avatarUrl?: string | null;
            note?: string | null;
            /**
             * @default active
             * @enum {string}
             */
            status: "active" | "inactive";
        };
        PersonFinancialSummaryOutput: {
            period: string;
            totalExpenses: number;
            history: {
                period: string;
                expenses: number;
                percentage: number;
            }[];
            paymentMethods: {
                /** @enum {string} */
                paymentMethod: "credit_card" | "debit_card" | "pix" | "cash" | "boleto" | "benefits" | "bank_transfer";
                amount: number;
                percentage: number;
            }[];
        };
        ReplacePersonInput: {
            name: string;
            /** Format: email */
            email?: string | null;
            avatarUrl?: string | null;
            note?: string | null;
            /**
             * @default active
             * @enum {string}
             */
            status: "active" | "inactive";
        };
        UpdatePersonInput: {
            name?: string;
            /** Format: email */
            email?: string | null;
            avatarUrl?: string | null;
            note?: string | null;
            /** @enum {string} */
            status?: "active" | "inactive";
        };
        CreatedPersonConnectionInvitation: components["schemas"]["PersonConnectionInvitation"] & {
            token: string;
        };
        PersonConnectionInvitation: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            personId: string;
            personName: string;
            /** @enum {string} */
            status: "pending" | "claimed" | "confirmed" | "cancelled" | "expired";
            claimedAccountName: string | null;
            /** Format: date-time */
            expiresAt: string;
            /** Format: date-time */
            confirmationExpiresAt: string | null;
            /** Format: date-time */
            createdAt: string;
        };
        CreatePersonConnectionInvitationInput: {
            /** Format: uuid */
            personId: string;
        };
        ClaimedPersonConnectionInvitation: {
            /** Format: uuid */
            invitationId: string;
            ownerName: string;
            personName: string;
            confirmationCode: string;
            /** Format: date-time */
            confirmationExpiresAt: string;
        };
        ClaimPersonConnectionInvitationInput: {
            token: string;
        };
        PersonConnection: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            invitationId: string;
            /** Format: uuid */
            personId: string | null;
            /** @enum {string} */
            perspective: "owner" | "recipient";
            /** @enum {string} */
            status: "active" | "revoked";
            counterpartName: string;
            /** Format: uri */
            counterpartAvatarUrl: string | null;
            /** Format: date-time */
            connectedAt: string;
            /** Format: date-time */
            revokedAt: string | null;
        };
        ConfirmPersonConnectionInput: {
            confirmationCode: string;
        };
        PersonReportOutput: {
            period: string;
            person: {
                /** Format: uuid */
                id: string;
                name: string;
            };
            balance: components["schemas"]["PersonBalanceOutput"];
            groups: {
                key: string;
                /** Format: uuid */
                cardId: string | null;
                cardName: string | null;
                cardLogo: string | null;
                /** Format: date */
                dueDate: string | null;
                /** @enum {string|null} */
                paymentMethod: "credit_card" | "debit_card" | "pix" | "cash" | "boleto" | "benefits" | "bank_transfer" | null;
                totalAmount: number;
                lines: {
                    id: string;
                    name: string;
                    /** Format: date */
                    purchaseDate: string;
                    amount: number;
                    /** @enum {string} */
                    kind: "expense" | "refund";
                    categoryName: string | null;
                    categoryIcon: string | null;
                    currentInstallment: number | null;
                    installmentCount: number | null;
                    isRecurring: boolean;
                }[];
            }[];
            settlements: {
                /** Format: uuid */
                id: string;
                amount: number;
                /** Format: date */
                receivedAt: string;
                /** @enum {string} */
                source: "manual" | "invoicePayment";
            }[];
            entryCount: number;
            comparison: {
                previousPeriod: string;
                previousAmount: number;
                differenceAmount: number;
                changePercentage: number | null;
            };
            commitments: {
                period: string;
                totalAmount: number;
                entryCount: number;
                installmentCount: number;
                recurringCount: number;
            }[];
        };
        PersonBalanceOutput: {
            assignedAmount: number;
            refundedAmount: number;
            settledAmount: number;
            dueAmount: number;
            coveredAmount: number;
            balanceAmount: number;
            receivableAmount: number;
            creditAmount: number;
            /** @enum {string} */
            status: "receivable" | "settled" | "credit";
        };
        PersonReportDocumentOutput: {
            title: string;
            html: string;
        };
        PersonReportDeliveriesOutput: {
            emailEnabled: boolean;
            deliveries: components["schemas"]["PersonReportDeliveryOutput"][];
        };
        PersonReportDeliveryOutput: {
            /** Format: uuid */
            id: string;
            period: string;
            /** @enum {string} */
            trigger: "manual" | "scheduled";
            /** @enum {string} */
            status: "pending" | "sent" | "failed";
            recipientEmail: string;
            includesSpreadsheet: boolean;
            /** Format: date */
            scheduledFor: string | null;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            sentAt: string | null;
        };
        CreatePersonReportDeliveryInput: {
            period: string;
            message?: string | null;
            /** @default false */
            includeSpreadsheet: boolean;
        };
        PersonReportScheduleStateOutput: {
            emailEnabled: boolean;
            sendingHour: number;
            schedule: components["schemas"]["PersonReportScheduleOutput"];
            nextDeliveryDates: string[];
        };
        PersonReportScheduleOutput: {
            enabled: boolean;
            /**
             * @example monthly
             * @enum {string}
             */
            frequency: "weekly" | "semimonthly" | "monthly" | "monthDays";
            /** @example null */
            weekday: number | null;
            /**
             * @example [
             *       1
             *     ]
             */
            monthDays: number[];
            /**
             * @example previous
             * @enum {string}
             */
            reportPeriod: "previous" | "current";
            includeSpreadsheet: boolean;
            /** Format: date-time */
            updatedAt: string;
        } | null;
        UpdatePersonReportScheduleInput: {
            enabled: boolean;
            /**
             * @example monthly
             * @enum {string}
             */
            frequency: "weekly" | "semimonthly" | "monthly" | "monthDays";
            /** @example null */
            weekday: number | null;
            /**
             * @example [
             *       1
             *     ]
             */
            monthDays: number[];
            /**
             * @example previous
             * @enum {string}
             */
            reportPeriod: "previous" | "current";
            includeSpreadsheet: boolean;
        };
        PersonSettlementsSummaryOutput: {
            period: string;
            totalReceivableAmount: number;
            totalCreditAmount: number;
            pendingCount: number;
            items: components["schemas"]["PersonSettlementSummaryItemOutput"][];
        };
        PersonSettlementSummaryItemOutput: {
            /** Format: uuid */
            personId: string;
            personName: string;
            personAvatarUrl: string | null;
            /** @enum {string} */
            personStatus: "active" | "inactive";
            balance: components["schemas"]["PersonBalanceOutput"];
        };
        PersonSettlementSnapshotOutput: {
            /** Format: uuid */
            personId: string;
            period: string;
            balance: components["schemas"]["PersonBalanceOutput"];
            settlements: components["schemas"]["PersonSettlementOutput"][];
        };
        PersonSettlementOutput: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            personId: string;
            amount: number;
            /** Format: date */
            receivedAt: string;
            note: string | null;
            /** @enum {string} */
            source: "manual" | "invoicePayment";
            /** Format: date-time */
            createdAt: string;
        };
        CreatePersonSettlementInput: {
            /** Format: uuid */
            personId: string;
            amount: number;
            receivedAt: string;
            note?: string | null;
        };
        ExternalExpensePage: {
            items: components["schemas"]["ExternalExpense"][];
            page: number;
            pageSize: number;
            total: number;
            totalAmount: number;
            totalPages: number;
        };
        ExternalExpense: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            connectionId: string;
            /** @enum {string} */
            sourceKind: "transaction" | "installmentSeries" | "recurringOccurrence";
            /** Format: uuid */
            sourceTransactionId: string | null;
            /** Format: uuid */
            sourceSeriesId: string | null;
            /** Format: uuid */
            sourceRecurringSeriesId: string | null;
            /** Format: uuid */
            sourceRecurringRuleId: string | null;
            /** Format: date */
            sourceOccurrenceDate: string | null;
            /** Format: uuid */
            importedTransactionId: string | null;
            counterpartName: string;
            /** Format: uri */
            counterpartAvatarUrl: string | null;
            /** @enum {string} */
            status: "pending" | "imported" | "ignored";
            sourceVersion: number;
            isDivided: boolean;
            snapshot: components["schemas"]["ExternalExpenseSnapshot"];
            categoryIcon: string | null;
            /** Format: uri */
            establishmentLogoUrl: string | null;
            sourceLogoUrl: string | null;
            /** @enum {string|null} */
            sourceCardBrand: "visa" | "mastercard" | "elo" | "amex" | "hipercard" | "other" | null;
            /** Format: date-time */
            importedAt: string | null;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        ExternalExpenseSnapshot: {
            name: string;
            amount: number;
            /** Format: date */
            purchaseDate: string;
            period: string;
            /** Format: date */
            dueDate: string | null;
            /** @enum {string} */
            paymentMethod: "credit_card" | "debit_card" | "pix" | "cash" | "boleto" | "benefits" | "bank_transfer";
            /** @enum {string} */
            condition: "single" | "installment" | "recurring";
            installmentCount: number | null;
            currentInstallment: number | null;
            sourceLabel: string | null;
        };
        ExternalExpenseSummary: {
            pendingCount: number;
            totalAmount: number;
            counterpartCount: number;
            latestCounterpartName: string | null;
            /** Format: date-time */
            latestUpdatedAt: string | null;
            latestPeriod: string | null;
        };
        ImportExternalExpenseOutput: {
            expense: components["schemas"]["ExternalExpense"];
            transaction: components["schemas"]["Transaction"];
        };
        Transaction: {
            /** @example 3f6d2b84-6ed0-4a50-b257-8adf0b6178de */
            id: string;
            /**
             * Format: uuid
             * @example 3f6d2b84-6ed0-4a50-b257-8adf0b6178de
             */
            recordId: string | null;
            /**
             * Format: uuid
             * @example 3f6d2b84-6ed0-4a50-b257-8adf0b6178de
             */
            recurringRuleId: string | null;
            /** Format: uuid */
            seriesId: string | null;
            /** Format: uuid */
            anticipationId: string | null;
            /** @example false */
            isRecurring: boolean;
            /**
             * @example expense
             * @enum {string}
             */
            type: "income" | "expense" | "transfer";
            /** @enum {string} */
            origin: "regular" | "invoicePayment" | "refund" | "accountBalanceAdjustment" | "invoiceAdjustment" | "personSettlement";
            /**
             * @example single
             * @enum {string}
             */
            condition: "single" | "installment" | "recurring";
            /**
             * @example pix
             * @enum {string|null}
             */
            paymentMethod: "credit_card" | "debit_card" | "pix" | "cash" | "boleto" | "benefits" | "bank_transfer" | null;
            /** @example Aluguel */
            name: string;
            /** @example -2500 */
            amount: number;
            /** @example 2500 */
            displayAmount: number;
            plannedAmount?: number;
            settledAmount?: number | null;
            /** Format: date */
            settledDate?: string | null;
            allocation: {
                /** Format: uuid */
                personId: string;
                personName: string;
                personAvatarUrl: string | null;
                amount: number;
                plannedAmount?: number;
            } | null;
            /**
             * Format: date
             * @example 2026-07-07
             */
            purchaseDate: string;
            /** Format: date */
            postingDate: string | null;
            /** @example 2026-07 */
            period: string;
            /**
             * Format: uuid
             * @example 3f6d2b84-6ed0-4a50-b257-8adf0b6178de
             */
            personId: string;
            /** @example Maria */
            personName: string;
            personAvatarUrl: string | null;
            /** Format: uuid */
            accountId: string | null;
            accountName: string | null;
            accountLogo: string | null;
            /** Format: uuid */
            cardId: string | null;
            cardName: string | null;
            cardLogo: string | null;
            invoicePaymentCardName: string | null;
            invoicePaymentCardLogo: string | null;
            /** Format: uuid */
            categoryId: string | null;
            tagIds?: string[];
            categoryName: string | null;
            categoryIcon: string | null;
            /** Format: uuid */
            sourceAccountId: string | null;
            sourceAccountName: string | null;
            sourceAccountLogo: string | null;
            /** Format: uuid */
            destinationAccountId: string | null;
            destinationAccountName: string | null;
            destinationAccountLogo: string | null;
            /** Format: date */
            dueDate: string | null;
            /** Format: date */
            originalDueDate?: string | null;
            dueDateAdjustment?: {
                /** @enum {string} */
                direction: "next" | "previous";
                ruleName: string | null;
                reasons: {
                    /** Format: date */
                    date: string;
                    /** @enum {string|null} */
                    weekend: "saturday" | "sunday" | null;
                    /** @enum {string|null} */
                    nationalHolidayId: "newYear" | "tiradentes" | "labourDay" | "independenceDay" | "ourLadyOfAparecida" | "allSoulsDay" | "republicProclamation" | "blackAwarenessDay" | "christmas" | null;
                    additionalHoliday: boolean;
                }[];
            } | null;
            dueDateExceptionEditable?: boolean;
            dueDateRuleExcluded?: boolean;
            /** Format: date */
            boletoPaymentDate: string | null;
            installmentCount: number | null;
            currentInstallment: number | null;
            installmentEndPeriod: string | null;
            /** @enum {string|null} */
            recurrenceFrequency: "weekly" | "monthly" | "bimonthly" | "quarterly" | "semiannual" | "annual" | null;
            /** Format: date */
            recurrenceAnchorDate?: string | null;
            /** Format: date */
            recurrenceEndDate?: string | null;
            isSettled: boolean | null;
            note: string | null;
            splitShares: {
                /** Format: uuid */
                personId: string;
                personName: string;
                personAvatarUrl: string | null;
                amount: number;
                plannedAmount?: number;
            }[];
            isDivided: boolean;
            /** Format: uuid */
            refundSourceId: string | null;
            refundedAmount: number;
            refundableAmount: number;
            hasAttachments: boolean;
            /** @example 2026-07-07T12:00:00.000Z */
            createdAt: string | null;
            /** @example 2026-07-07T12:00:00.000Z */
            updatedAt: string | null;
        };
        ImportExternalExpenseInput: {
            expectedVersion: number;
            transaction: components["schemas"]["CreateTransaction"];
        };
        CreateTransaction: {
            tagIds?: string[];
            /**
             * @example expense
             * @enum {string}
             */
            type: "income" | "expense" | "transfer";
            /**
             * @default single
             * @example single
             * @enum {string}
             */
            condition: "single" | "installment" | "recurring";
            /**
             * @example pix
             * @enum {string}
             */
            paymentMethod: "credit_card" | "debit_card" | "pix" | "cash" | "boleto" | "benefits" | "bank_transfer";
            /** @example Aluguel */
            name: string;
            /** @example 2500 */
            amount: number;
            /**
             * Format: date
             * @example 2026-07-07
             */
            purchaseDate: string;
            /** @example 2026-08 */
            invoicePeriod?: string | null;
            /**
             * Format: uuid
             * @example 3f6d2b84-6ed0-4a50-b257-8adf0b6178de
             */
            personId: string;
            /**
             * Format: uuid
             * @example 3f6d2b84-6ed0-4a50-b257-8adf0b6178de
             */
            accountId?: string | null;
            /**
             * Format: uuid
             * @example 3f6d2b84-6ed0-4a50-b257-8adf0b6178de
             */
            cardId?: string | null;
            /**
             * Format: uuid
             * @example 3f6d2b84-6ed0-4a50-b257-8adf0b6178de
             */
            categoryId?: string | null;
            /**
             * Format: uuid
             * @example 3f6d2b84-6ed0-4a50-b257-8adf0b6178de
             */
            sourceAccountId?: string | null;
            /**
             * Format: uuid
             * @example 3f6d2b84-6ed0-4a50-b257-8adf0b6178de
             */
            destinationAccountId?: string | null;
            dueDateRuleExcluded?: boolean;
            /**
             * Format: date
             * @example 2026-07-10
             */
            dueDate?: string | null;
            /** Format: date */
            settledDate?: string | null;
            /**
             * Format: date
             * @example 2026-07-09
             */
            boletoPaymentDate?: string | null;
            /** @example 12 */
            installmentCount?: number | null;
            /**
             * @example monthly
             * @enum {string|null}
             */
            recurrenceFrequency?: "weekly" | "monthly" | "bimonthly" | "quarterly" | "semiannual" | "annual" | null;
            /**
             * Format: date
             * @description Inclusive optional last occurrence date. Null means no deadline; version boundaries are managed independently.
             * @example 2027-12-31
             */
            recurrenceEndDate?: string | null;
            /** @example true */
            isSettled?: boolean | null;
            /** @example Contrato residencial */
            note?: string | null;
            splitShares?: {
                /** Format: uuid */
                personId: string;
                amount: number;
            }[] | null;
            /** @example 5 */
            startInstallment?: number;
        };
        ReviewExternalExpenseInput: {
            expectedVersion: number;
        };
        NotesPage: {
            items: components["schemas"]["Note"][];
            total: number;
            hasMore: boolean;
        };
        Note: {
            /** Format: uuid */
            id: string;
            title: string;
            /** @enum {string} */
            kind: "text" | "checklist" | "task";
            content: string | null;
            /** Format: date */
            dueDate: string | null;
            isCompleted: boolean;
            isArchived: boolean;
            items: components["schemas"]["NoteItem"][];
            totalItemCount: number;
            completedItemCount: number;
            completionPercentage: number;
            version: number;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        NoteItem: {
            /** Format: uuid */
            id: string;
            text: string;
            isCompleted: boolean;
            position: number;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        SetTaskCompletionInput: {
            isCompleted: boolean;
        };
        CreateNoteInput: {
            title: string;
            /** @enum {string} */
            kind: "text";
            content: string;
        } | {
            title: string;
            /** @enum {string} */
            kind: "checklist";
            items: {
                text: string;
            }[];
        } | {
            title: string;
            /** @enum {string} */
            kind: "task";
            content?: string | null;
            /** Format: date */
            dueDate: string;
        };
        ReplaceNoteInput: {
            expectedVersion: number;
            title: string;
            /** @enum {string} */
            kind: "text";
            content: string;
        } | {
            expectedVersion: number;
            title: string;
            /** @enum {string} */
            kind: "checklist";
            items: {
                /** Format: uuid */
                id?: string;
                text: string;
                isCompleted: boolean;
            }[];
        } | {
            expectedVersion: number;
            title: string;
            /** @enum {string} */
            kind: "task";
            content: string | null;
            /** Format: date */
            dueDate: string;
            isCompleted: boolean;
        };
        ArchiveNoteInput: {
            isArchived: boolean;
        };
        SetNoteItemCompletionInput: {
            isCompleted: boolean;
        };
        RecurringTransactionsReport: {
            period: string;
            /** @enum {string} */
            type: "expense" | "income";
            summary: {
                activeCount: number;
                pausedCount: number;
                endedCount: number;
                projectedTotal: number;
            };
            projections: {
                period: string;
                total: number;
            }[];
            items: components["schemas"]["RecurringTransactionReportItem"][];
        };
        RecurringTransactionReportItem: {
            /** Format: uuid */
            id: string;
            name: string;
            amount: number;
            totalAmount: number;
            /** @enum {string} */
            paymentMethod: "credit_card" | "debit_card" | "pix" | "cash" | "boleto" | "benefits" | "bank_transfer";
            /** @enum {string} */
            frequency: "weekly" | "monthly" | "bimonthly" | "quarterly" | "semiannual" | "annual";
            /** Format: date */
            recurrenceEndDate?: string | null;
            /** Format: date */
            purchaseDate: string;
            personName: string;
            personAvatarUrl: string | null;
            accountName: string | null;
            accountLogo: string | null;
            categoryName: string | null;
            categoryIcon: string | null;
            cardName: string | null;
            cardLogo: string | null;
            splitPeople: {
                /** Format: uuid */
                id: string;
                name: string;
                avatarUrl: string | null;
                amount: number;
            }[];
            isSettled: boolean;
            canEdit: boolean;
            /** Format: uuid */
            seriesId: string;
            /** @enum {string} */
            type: "expense" | "income";
            /** @enum {string} */
            status: "active" | "paused" | "ended";
            /** Format: date */
            actionDate: string | null;
            /** Format: date */
            nextOccurrenceDate: string | null;
        };
        RecurringExpensesReport: {
            period: string;
            summary: {
                activeCount: number;
                pausedCount: number;
                projectedTotal: number;
            };
            projections: {
                period: string;
                total: number;
            }[];
            items: components["schemas"]["RecurringExpensesReportItem"][];
        };
        RecurringExpensesReportItem: components["schemas"]["RecurringExpense"] & {
            /** Format: date */
            actionDate: string | null;
            /** Format: date */
            nextOccurrenceDate: string | null;
        };
        RecurringExpense: {
            /** Format: uuid */
            id: string;
            name: string;
            amount: number;
            totalAmount: number;
            /** @enum {string} */
            paymentMethod: "credit_card" | "debit_card" | "pix" | "cash" | "boleto" | "benefits" | "bank_transfer";
            /** @enum {string} */
            frequency: "weekly" | "monthly" | "bimonthly" | "quarterly" | "semiannual" | "annual";
            /** Format: date */
            recurrenceEndDate?: string | null;
            /** Format: date */
            purchaseDate: string;
            personName: string;
            personAvatarUrl: string | null;
            accountName: string | null;
            accountLogo: string | null;
            categoryName: string | null;
            categoryIcon: string | null;
            cardName: string | null;
            cardLogo: string | null;
            splitPeople: {
                /** Format: uuid */
                id: string;
                name: string;
                avatarUrl: string | null;
                amount: number;
            }[];
            isSettled: boolean;
            canEdit: boolean;
            /** @enum {string} */
            status: "active" | "paused";
        };
        RecurringExpenses: {
            period: string;
            items: components["schemas"]["RecurringExpense"][];
        };
        RecurringExpenseAction: {
            /** @enum {boolean} */
            success: true;
        };
        UpdateRecurringExpenseInput: {
            /** @enum {string} */
            scope: "single" | "future";
            name: string;
            amount: number;
            splitShares?: {
                /** Format: uuid */
                personId: string;
                amount: number;
            }[];
        };
        TransactionExport: {
            fileName: string;
            /** @enum {string} */
            contentType: "text/csv;charset=utf-8" | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            contentBase64: string;
            rowCount: number;
        };
        InstallmentOptionsOutput: {
            options: {
                count: number;
                minimumAmount: number;
                maximumAmount: number;
            }[];
        };
        RecurrenceEndDateOutput: {
            /**
             * Format: date
             * @description Inclusive recurrenceEndDate that keeps exactly occurrenceCount occurrences from startDate; null when no date can keep that count
             */
            endDate: string | null;
        };
        RecentEstablishmentsResponse: {
            data: components["schemas"]["RecentEstablishments"];
            error: unknown;
        };
        RecentEstablishments: {
            items: string[];
        };
        TransactionRefund: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            sourceTransactionId: string;
            amount: number;
            remainingRefundableAmount: number;
        };
        CreateTransactionRefundInput: {
            amount: number;
            /** Format: date */
            receivedAt: string;
            invoicePeriod?: string | null;
            note?: string | null;
        };
        TransactionImportPreview: {
            sourceName: string;
            sourceFingerprint: string;
            accountNumber: string | null;
            period: {
                /** Format: date */
                from: string;
                /** Format: date */
                to: string;
            } | null;
            isCreditCard: boolean;
            transactions: {
                externalId: string | null;
                /** Format: date */
                purchaseDate: string;
                amount: number;
                name: string;
                /** @enum {string} */
                type: "income" | "expense";
                categoryName: string | null;
                isDuplicate: boolean;
                /** Format: uuid */
                suggestedCategoryId: string | null;
            }[];
        };
        PreviewTransactionImportInput: {
            fileName: string;
            contentBase64: string;
        };
        TransactionImportResult: {
            /** Format: uuid */
            batchId: string;
            imported: number;
            skipped: number;
        };
        ImportTransactionsInput: {
            sourceFingerprint: string;
            /** @enum {string} */
            destinationType: "account" | "card";
            /** Format: uuid */
            destinationId: string;
            /** @enum {string} */
            paymentMethod: "credit_card" | "debit_card" | "pix" | "cash" | "boleto" | "benefits" | "bank_transfer";
            invoicePeriod?: string | null;
            rows: {
                externalId: string | null;
                /** Format: date */
                purchaseDate: string;
                amount: number;
                name: string;
                /** @enum {string} */
                type: "income" | "expense";
                /** Format: uuid */
                personId: string;
                /** Format: uuid */
                categoryId: string;
            }[];
        };
        TransactionResponse: {
            data: components["schemas"]["Transaction"];
            error: unknown;
        };
        BulkTransactionsResponse: {
            data: components["schemas"]["BulkTransactionsOutput"];
            error: unknown;
        };
        BulkTransactionsOutput: {
            ids: string[];
        };
        BulkCategorizeTransactionsInput: {
            ids: string[];
            /** Format: uuid */
            categoryId: string;
        };
        BulkRenameTransactionsInput: {
            items: {
                /** Format: uuid */
                id: string;
                name: string;
            }[];
        };
        BulkTagTransactionsInput: {
            ids: string[];
            /** @enum {string} */
            operation: "add" | "remove";
            tagIds: string[];
        };
        BulkDeleteTransactionsInput: {
            ids: string[];
        };
        UpdateTransaction: {
            tagIds?: string[];
            /**
             * @example expense
             * @enum {string}
             */
            type?: "income" | "expense" | "transfer";
            /**
             * @example pix
             * @enum {string}
             */
            paymentMethod?: "credit_card" | "debit_card" | "pix" | "cash" | "boleto" | "benefits" | "bank_transfer";
            /** @example Aluguel */
            name?: string;
            /** @example 2500 */
            amount?: number;
            /**
             * Format: date
             * @example 2026-07-07
             */
            purchaseDate?: string;
            /** @example 2026-08 */
            invoicePeriod?: string | null;
            /**
             * Format: uuid
             * @example 3f6d2b84-6ed0-4a50-b257-8adf0b6178de
             */
            personId?: string;
            /**
             * Format: uuid
             * @example 3f6d2b84-6ed0-4a50-b257-8adf0b6178de
             */
            accountId?: string | null;
            /**
             * Format: uuid
             * @example 3f6d2b84-6ed0-4a50-b257-8adf0b6178de
             */
            cardId?: string | null;
            /**
             * Format: uuid
             * @example 3f6d2b84-6ed0-4a50-b257-8adf0b6178de
             */
            categoryId?: string | null;
            /**
             * Format: uuid
             * @example 3f6d2b84-6ed0-4a50-b257-8adf0b6178de
             */
            sourceAccountId?: string | null;
            /**
             * Format: uuid
             * @example 3f6d2b84-6ed0-4a50-b257-8adf0b6178de
             */
            destinationAccountId?: string | null;
            dueDateRuleExcluded?: boolean;
            /**
             * Format: date
             * @example 2026-07-10
             */
            dueDate?: string | null;
            /** Format: date */
            settledDate?: string | null;
            /**
             * Format: date
             * @example 2026-07-09
             */
            boletoPaymentDate?: string | null;
            /** @example 12 */
            installmentCount?: number | null;
            /**
             * @example monthly
             * @enum {string|null}
             */
            recurrenceFrequency?: "weekly" | "monthly" | "bimonthly" | "quarterly" | "semiannual" | "annual" | null;
            /**
             * Format: date
             * @description Inclusive optional last occurrence date. Null means no deadline; version boundaries are managed independently.
             * @example 2027-12-31
             */
            recurrenceEndDate?: string | null;
            /** @example true */
            isSettled?: boolean | null;
            /** @example Contrato residencial */
            note?: string | null;
            splitShares?: {
                /** Format: uuid */
                personId: string;
                amount: number;
            }[] | null;
            /** @enum {string} */
            condition?: "single" | "installment" | "recurring";
        };
        DeleteTransactionResponse: {
            data: {
                /** Format: uuid */
                id: string;
            };
            error: unknown;
        };
        RecurringOccurrenceActionInput: {
            /** @enum {string} */
            action: "pause" | "resume" | "skip" | "stop";
            /** Format: date */
            occurrenceDate: string;
        };
        TransactionsResponse: {
            data: components["schemas"]["PaginatedTransactions"];
            error: unknown;
        };
        PaginatedTransactions: {
            items: components["schemas"]["Transaction"][];
            total: number;
            page: number;
            pageSize: number;
        };
        DashboardSnapshot: {
            metrics: components["schemas"]["DashboardMetrics"];
            accounts: components["schemas"]["DashboardAccounts"];
            paymentStatus: components["schemas"]["DashboardPaymentStatus"];
            expenseDistribution: components["schemas"]["DashboardExpenseDistribution"];
            categoryBreakdown: components["schemas"]["DashboardCategoryBreakdown"];
            peopleExpenses: components["schemas"]["DashboardPeopleExpenses"];
        };
        DashboardMetrics: {
            period: string;
            previousPeriod: string;
            income: {
                current: number;
                hasPreviousData: boolean;
                previous: number;
            };
            expenses: {
                current: number;
                hasPreviousData: boolean;
                previous: number;
            };
            balance: {
                current: number;
                hasPreviousData: boolean;
                previous: number;
            };
            projected: {
                current: number;
                hasPreviousData: boolean;
                previous: number;
            };
            history: {
                period: string;
                income: number;
                expenses: number;
                balance: number;
            }[];
        };
        DashboardAccounts: {
            period: string;
            scope: {
                /** @enum {string} */
                accountingBasis: "cash";
                /** @enum {boolean} */
                includePending: false;
                /** @enum {string} */
                personScope: "primary";
            };
            totalBalance: number;
            items: components["schemas"]["DashboardAccount"][];
        };
        DashboardAccount: {
            /** Format: uuid */
            id: string;
            name: string;
            /** @enum {string} */
            type: "checking" | "savings" | "investment" | "cash" | "benefits" | "other";
            logo: string | null;
            balance: number;
            excludeFromBalance: boolean;
        };
        DashboardPaymentStatus: {
            period: string;
            income: {
                total: number;
                confirmed: number;
                pending: number;
            };
            expenses: {
                total: number;
                confirmed: number;
                pending: number;
            };
        };
        DashboardExpenseDistribution: {
            period: string;
            totalAmount: number;
            transactionCount: number;
            conditions: {
                /** @enum {string} */
                key: "single" | "installment" | "recurring";
                amount: number;
                count: number;
                percentage: number;
            }[];
            paymentMethods: {
                /** @enum {string} */
                key: "credit_card" | "debit_card" | "pix" | "cash" | "boleto" | "benefits" | "bank_transfer";
                amount: number;
                count: number;
                percentage: number;
            }[];
        };
        DashboardCategoryBreakdown: {
            period: string;
            previousPeriod: string;
            incomeTotal: number;
            expensesTotal: number;
            income: {
                /** Format: uuid */
                categoryId: string;
                categoryName: string;
                categoryIcon: string | null;
                amount: number;
                previousAmount: number;
                count: number;
                percentage: number;
            }[];
            expenses: {
                /** Format: uuid */
                categoryId: string;
                categoryName: string;
                categoryIcon: string | null;
                amount: number;
                previousAmount: number;
                count: number;
                percentage: number;
            }[];
        };
        DashboardPeopleExpenses: {
            period: string;
            previousPeriod: string;
            totalAmount: number;
            items: {
                /** Format: uuid */
                personId: string;
                personName: string;
                personAvatarUrl: string | null;
                /** @enum {string} */
                personRole: "admin" | "external";
                /** @enum {string} */
                personStatus: "active" | "inactive";
                amount: number;
                previousAmount: number;
                count: number;
                percentage: number;
            }[];
        };
        DashboardAttention: {
            period: string;
            items: components["schemas"]["DashboardAttentionItem"][];
            unavailableSources: ("invoice" | "bill" | "budget" | "inbox")[];
        };
        DashboardAttentionItem: {
            id: string;
            /** @enum {string} */
            kind: "invoice" | "bill" | "budget" | "inbox";
            /** @enum {string} */
            severity: "critical" | "warning" | "info";
            title: string | null;
            logo: string | null;
            categoryIcon: string | null;
            amount: number | null;
            /** Format: date */
            dueDate: string | null;
            daysUntilDue: number | null;
            count: number | null;
            usagePercentage: number | null;
            /** @enum {string|null} */
            budgetStatus: "warning" | "reached" | "exceeded" | null;
            referenceId: string | null;
            period: string | null;
        };
        DashboardWidgetPreferences: {
            order: ("attention" | "accounts" | "invoices" | "bills" | "payment-status" | "recurring-expenses" | "installments" | "inbox" | "person-settlements" | "budgets" | "goals" | "commitments" | "income-expense-balance" | "expense-categories" | "category-trends" | "income-categories" | "category-transactions" | "people" | "payment-conditions" | "payment-methods" | "notes")[];
            hidden: ("attention" | "accounts" | "invoices" | "bills" | "payment-status" | "recurring-expenses" | "installments" | "inbox" | "person-settlements" | "budgets" | "goals" | "commitments" | "income-expense-balance" | "expense-categories" | "category-trends" | "income-categories" | "category-transactions" | "people" | "payment-conditions" | "payment-methods" | "notes")[];
        };
        DashboardWidgetPreferencesInput: {
            order: ("attention" | "accounts" | "invoices" | "bills" | "payment-status" | "recurring-expenses" | "installments" | "inbox" | "person-settlements" | "budgets" | "goals" | "commitments" | "income-expense-balance" | "expense-categories" | "category-trends" | "income-categories" | "category-transactions" | "people" | "payment-conditions" | "payment-methods" | "notes")[];
            hidden: ("attention" | "accounts" | "invoices" | "bills" | "payment-status" | "recurring-expenses" | "installments" | "inbox" | "person-settlements" | "budgets" | "goals" | "commitments" | "income-expense-balance" | "expense-categories" | "category-trends" | "income-categories" | "category-transactions" | "people" | "payment-conditions" | "payment-methods" | "notes")[];
        };
        AiProviders: {
            enabled: boolean;
            items: components["schemas"]["AiProvider"][];
        };
        AiProvider: {
            /** @enum {string} */
            provider: "claude" | "codex" | "antigravity";
            /** @enum {string} */
            status: "connected" | "disconnected" | "unavailable";
            /** Format: date-time */
            consentedAt: string | null;
            preferredModel: string | null;
            /** Format: email */
            accountEmail: string | null;
            models: components["schemas"]["AiProviderModel"][];
        };
        AiProviderModel: {
            id: string;
            name: string;
            isDefault: boolean;
        };
        AiProviderLogin: {
            /** Format: uuid */
            loginId: string;
            /** @enum {string} */
            provider: "claude" | "codex" | "antigravity";
            /** @enum {string} */
            method: "authorizationCode" | "deviceCode";
            /** @enum {string} */
            status: "pending" | "connected" | "failed" | "expired";
            /** Format: uri */
            verificationUrl: string | null;
            userCode: string | null;
            /** Format: date-time */
            expiresAt: string;
        };
        StartAiProviderLoginInput: {
            /** @enum {boolean} */
            acceptDataSharing: true;
        };
        SubmitAiProviderLoginCodeInput: {
            code: string;
        };
        UpdateAiProviderInput: {
            preferredModel: string | null;
        };
        AiTools: {
            allowed: boolean;
            items: components["schemas"]["AiTool"][];
        };
        AiTool: {
            /** @enum {string} */
            provider: "claude" | "codex" | "antigravity";
            bundledVersion: string | null;
            activeVersion: string | null;
            previousVersion: string | null;
            latest: components["schemas"]["AiToolRelease"];
            job: components["schemas"]["AiToolJob"];
        };
        AiToolRelease: {
            version: string;
            /** Format: date-time */
            releasedAt: string;
            /** Format: date-time */
            eligibleAt: string;
            /** @enum {string|null} */
            blocker: "tooRecent" | "notNewer" | "unknownVersion" | "downloadFailed" | "integrityMismatch" | "signatureInvalid" | "smokeTestFailed" | "canaryFailed" | "busy" | "installFailed" | null;
        } | null;
        AiToolJob: {
            /** Format: uuid */
            jobId: string;
            /** @enum {string} */
            provider: "claude" | "codex" | "antigravity";
            version: string;
            /** @enum {string} */
            status: "pending" | "completed" | "failed";
            /** @enum {string} */
            step: "download" | "verify" | "test" | "activate";
            /** @enum {string|null} */
            failureCode: "tooRecent" | "notNewer" | "unknownVersion" | "downloadFailed" | "integrityMismatch" | "signatureInvalid" | "smokeTestFailed" | "canaryFailed" | "busy" | "installFailed" | null;
            /** Format: date-time */
            startedAt: string;
        } | null;
        AiToolEvents: {
            items: components["schemas"]["AiToolEvent"][];
        };
        AiToolEvent: {
            /** Format: uuid */
            id: string;
            /** @enum {string} */
            provider: "claude" | "codex" | "antigravity";
            /** @enum {string} */
            action: "install" | "activate" | "restoreBundled";
            fromVersion: string | null;
            toVersion: string | null;
            /** @enum {string} */
            status: "pending" | "completed" | "failed";
            /** @enum {string|null} */
            failureCode: "tooRecent" | "notNewer" | "unknownVersion" | "downloadFailed" | "integrityMismatch" | "signatureInvalid" | "smokeTestFailed" | "canaryFailed" | "busy" | "installFailed" | null;
            /** Format: date-time */
            createdAt: string;
        };
        InstallAiToolInput: {
            version: string;
            /** @default false */
            canary: boolean;
        };
        ActivateAiToolInput: {
            version: string | null;
        };
        AiChats: {
            items: components["schemas"]["AiChatSummary"][];
        };
        AiChatSummary: {
            /** Format: uuid */
            id: string;
            title: string;
            period: string;
            /** @enum {string} */
            provider: "claude" | "codex" | "antigravity";
            model: string | null;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        AiChat: components["schemas"]["AiChatSummary"] & {
            messages: components["schemas"]["AiChatMessage"][];
        };
        AiChatMessage: {
            /** Format: uuid */
            id: string;
            /** @enum {string} */
            role: "user" | "assistant";
            content: string;
            reasoning: string | null;
            /** @enum {string} */
            status: "streaming" | "completed" | "failed" | "canceled";
            /** @enum {string|null} */
            failureCode: "providerDisconnected" | "providerLimitReached" | "providerBusy" | "serviceUnavailable" | "runFailed" | "timedOut" | "interrupted" | null;
            /** @enum {string|null} */
            provider: "claude" | "codex" | "antigravity" | null;
            model: {
                id: string;
                name: string;
            } | null;
            sharedScopes: ("categoryNames" | "transactions" | "people" | "notes" | "accounts" | "budgetsAndGoals")[];
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            completedAt: string | null;
        };
        CreateAiChatInput: {
            period: string;
            /** @enum {string} */
            provider: "claude" | "codex" | "antigravity";
            model?: string | null;
        };
        UpdateAiChatInput: {
            title: string;
        };
        AiChatStreamEvent: {
            /** @enum {string} */
            type: "start";
            chat: components["schemas"]["AiChatSummary"];
            userMessage: components["schemas"]["AiChatMessage"] & unknown;
            assistantMessage: components["schemas"]["AiChatMessage"];
        } | {
            /** @enum {string} */
            type: "delta";
            text: string;
        } | {
            /** @enum {string} */
            type: "reasoning";
            text: string;
        } | {
            /** @enum {string} */
            type: "done";
            message: components["schemas"]["AiChatMessage"];
        };
        SendAiChatMessageInput: {
            content: string;
            /** @enum {string} */
            provider: "claude" | "codex" | "antigravity";
            model?: string | null;
            /** @enum {string} */
            voice?: "balanced" | "direct" | "encouraging" | "sarcastic" | "stern";
        };
        RegenerateAiChatReplyInput: {
            /** @enum {string} */
            provider: "claude" | "codex" | "antigravity";
            model?: string | null;
            /** @enum {string} */
            voice?: "balanced" | "direct" | "encouraging" | "sarcastic" | "stern";
        };
        AiDataSharing: {
            scopes: ("categoryNames" | "transactions" | "people" | "notes" | "accounts" | "budgetsAndGoals")[];
            isFull: boolean;
            retentionDays: 30 | 90 | 365 | unknown;
            /** Format: date-time */
            updatedAt: string | null;
        };
        UpdateAiDataSharingInput: {
            scopes: ("categoryNames" | "transactions" | "people" | "notes" | "accounts" | "budgetsAndGoals")[];
        };
        AiDataPreview: {
            period: string;
            scopes: ("categoryNames" | "transactions" | "people" | "notes" | "accounts" | "budgetsAndGoals")[];
            data: {
                [key: string]: unknown;
            };
        };
        UpdateAiDataRetentionInput: {
            retentionDays: 30 | 90 | 365 | unknown;
        };
        AiDataHistoryDeleted: {
            chats: number;
            diagnoses: number;
        };
        AiDiagnoses: {
            items: components["schemas"]["AiDiagnosisSummary"][];
        };
        AiDiagnosisSummary: {
            /** Format: uuid */
            id: string;
            period: string;
            /** @enum {string} */
            provider: "claude" | "codex" | "antigravity";
            model: {
                id: string;
                name: string;
            } | null;
            /** @enum {string} */
            voice: "balanced" | "direct" | "encouraging" | "sarcastic" | "stern";
            /** @enum {string} */
            status: "pending" | "completed" | "failed";
            /** @enum {string|null} */
            failureCode: "providerDisconnected" | "providerLimitReached" | "providerBusy" | "invalidOutput" | "serviceUnavailable" | "runFailed" | "timedOut" | "interrupted" | "canceled" | null;
            score: number;
            /** @enum {string} */
            level: "excellent" | "good" | "fair" | "poor";
            /** Format: date-time */
            createdAt: string;
        };
        AiDiagnosis: {
            /** Format: uuid */
            id: string;
            period: string;
            /** @enum {string} */
            provider: "claude" | "codex" | "antigravity";
            requestedModel: string | null;
            sharedScopes: ("categoryNames" | "transactions" | "people" | "notes" | "accounts" | "budgetsAndGoals")[];
            /** @enum {string} */
            voice: "balanced" | "direct" | "encouraging" | "sarcastic" | "stern";
            model: {
                id: string;
                name: string;
            } | null;
            /** @enum {string} */
            status: "pending" | "completed" | "failed";
            /** @enum {string|null} */
            failureCode: "providerDisconnected" | "providerLimitReached" | "providerBusy" | "invalidOutput" | "serviceUnavailable" | "runFailed" | "timedOut" | "interrupted" | "canceled" | null;
            health: components["schemas"]["FinancialHealth"];
            result: components["schemas"]["AiDiagnosisResult"];
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            completedAt: string | null;
        };
        FinancialHealth: {
            score: number;
            /** @enum {string} */
            level: "excellent" | "good" | "fair" | "poor";
            indicators: {
                savingsRate: number | null;
                averageSavingsRate: number | null;
                averageMonthlyExpenses: number | null;
                emergencyFundMonths: number | null;
                expenseTrend: number | null;
                topCategoryShare: number | null;
                criticalAttentionItems: number;
                warningAttentionItems: number;
            };
            charts: {
                incomeExpenseHistory: {
                    period: string;
                    income: number;
                    expenses: number;
                }[];
                savingsRateHistory: {
                    period: string;
                    savingsRate: number | null;
                }[];
                topExpenseCategories: {
                    categoryId: string;
                    categoryName: string;
                    amount: number;
                    previousAmount: number;
                    share: number;
                }[];
                monthlyBalanceHistory: {
                    period: string;
                    balance: number;
                }[];
            };
        };
        AiDiagnosisResult: {
            headline: string;
            summary: string;
            sections: {
                title: string;
                body: string;
                /** @enum {string} */
                tone: "positive" | "neutral" | "attention" | "critical";
            }[];
            charts: ("incomeExpenseHistory" | "savingsRateHistory" | "topExpenseCategories" | "monthlyBalanceHistory")[];
            actions: {
                /** @enum {string} */
                kind: "reviewCategoryTransactions" | "createCategoryBudget" | "reviewBudgets" | "reviewInvoices" | "reviewBills" | "reviewRecurringTransactions" | "createGoal";
                label: string;
                reason: string;
                /** Format: uuid */
                categoryId: string | null;
            }[];
        } | null;
        CreateAiDiagnosisInput: {
            period: string;
            /** @enum {string} */
            provider: "claude" | "codex" | "antigravity";
            model?: string | null;
            /** @enum {string} */
            voice?: "balanced" | "direct" | "encouraging" | "sarcastic" | "stern";
        };
        UpdateInvoiceDatesInput: {
            /** Format: date */
            closingDate: string;
            /** Format: date */
            dueDate: string;
        };
        AdjustInvoiceInput: {
            amount: number;
            /** Format: date */
            date: string;
            /** Format: uuid */
            personId: string;
        };
        DashboardInvoices: {
            period: string;
            totalRemaining: number;
            accounts: {
                /** Format: uuid */
                id: string;
                name: string;
                logo: string | null;
            }[];
            items: {
                /** Format: uuid */
                cardId: string;
                /** Format: uuid */
                accountId: string;
                cardName: string;
                logo: string | null;
                period: string;
                amount: number;
                paidAmount: number;
                remainingAmount: number;
                /** @enum {string} */
                status: "open" | "closed" | "overdue" | "paid";
                /** Format: date */
                closingDate: string;
                /** Format: date */
                dueDate: string;
                /** Format: date */
                originalDueDate?: string | null;
                dueDateAdjustment?: {
                    /** @enum {string} */
                    direction: "next" | "previous";
                    ruleName: string | null;
                    reasons: {
                        /** Format: date */
                        date: string;
                        /** @enum {string|null} */
                        weekend: "saturday" | "sunday" | null;
                        /** @enum {string|null} */
                        nationalHolidayId: "newYear" | "tiradentes" | "labourDay" | "independenceDay" | "ourLadyOfAparecida" | "allSoulsDay" | "republicProclamation" | "blackAwarenessDay" | "christmas" | null;
                        additionalHoliday: boolean;
                    }[];
                } | null;
                dueDateExceptionEditable?: boolean;
                dueDateRuleExcluded?: boolean;
                paymentCount: number;
                latestPayment: {
                    /** Format: uuid */
                    id: string;
                    amount: number;
                    /** Format: date */
                    paidAt: string;
                } | null;
                payments: {
                    /** Format: uuid */
                    id: string;
                    amount: number;
                    /** Format: date */
                    paidAt: string;
                }[];
                people: {
                    /** Format: uuid */
                    personId: string;
                    personName: string;
                    personAvatarUrl: string | null;
                    /** @enum {string} */
                    personRole: "admin" | "external";
                    amount: number;
                    paidAmount: number;
                    remainingAmount: number;
                }[];
            }[];
        };
        CreateInvoicePaymentInput: {
            /** Format: uuid */
            accountId?: string | null;
            /** Format: date */
            paidAt: string;
            allocations: {
                /** Format: uuid */
                personId: string;
                amount: number;
            }[];
        };
        PaginatedAttachments: {
            items: components["schemas"]["AttachmentListItem"][];
            total: number;
            page: number;
            pageSize: number;
            counts: {
                all: number;
                images: number;
                pdfs: number;
            };
            people: {
                /** Format: uuid */
                id: string;
                name: string;
                avatarUrl: string | null;
                count: number;
            }[];
        };
        AttachmentListItem: components["schemas"]["Attachment"] & {
            linkedTransactionCount: number;
            /** Format: uuid */
            transactionId: string;
            transactionName: string;
            transactionAmount: number;
            /** @enum {string} */
            transactionType: "income" | "expense" | "transfer";
            /** Format: date */
            purchaseDate: string;
            transactionPeriod: string;
            /** Format: uuid */
            personId: string;
            personName: string;
            personAvatarUrl: string | null;
            categoryName: string | null;
            categoryIcon: string | null;
        };
        Attachment: {
            /** Format: uuid */
            id: string;
            fileName: string;
            fileSize: number;
            /** @enum {string} */
            mimeType: "application/pdf" | "image/jpeg" | "image/png" | "image/webp";
            /** Format: date-time */
            createdAt: string;
        };
        PreparedAttachment: {
            /** Format: uuid */
            uploadId: string;
            /** Format: uri */
            uploadUrl: string;
        };
        PrepareAttachmentInput: {
            /** Format: uuid */
            transactionId: string;
            fileName: string;
            fileSize: number;
            /** @enum {string} */
            mimeType: "application/pdf" | "image/jpeg" | "image/png" | "image/webp";
        };
        ConfirmAttachmentInput: {
            /** Format: uuid */
            uploadId: string;
            /** Format: uuid */
            transactionId: string;
        };
        AttachmentUrl: {
            /** Format: uri */
            url: string;
            /** Format: date-time */
            expiresAt: string;
        };
        FinancialDistribution: {
            period: string;
            /** @enum {string} */
            mode: "actual" | "forecast";
            incomeAmount: number;
            expenseAmount: number;
            balanceAmount: number;
            flowAmount: number;
            categories: {
                key: string;
                /** Format: uuid */
                categoryId: string | null;
                name: string;
                icon: string | null;
                /** @enum {string} */
                type: "income" | "expense";
                amount: number;
                percentage: number | null;
                directAmount: number;
                children: {
                    key: string;
                    /** Format: uuid */
                    categoryId: string | null;
                    name: string;
                    icon: string | null;
                    /** @enum {string} */
                    type: "income" | "expense";
                    amount: number;
                    percentage: number | null;
                    directAmount: number;
                }[];
            }[];
            sources: {
                key: string;
                /** Format: uuid */
                categoryId: string | null;
                name: string;
                /** @enum {string} */
                kind: "income" | "expense" | "refund" | "surplus" | "deficit";
                amount: number;
                percentage: number;
                grouped: boolean;
            }[];
            destinations: {
                key: string;
                /** Format: uuid */
                categoryId: string | null;
                name: string;
                /** @enum {string} */
                kind: "income" | "expense" | "refund" | "surplus" | "deficit";
                amount: number;
                percentage: number;
                grouped: boolean;
            }[];
            leadingExpensesAmount: number;
            leadingExpensesPercentage: number | null;
            savingsRatePercentage: number | null;
            comparison: {
                previousPeriod: string;
                previousIncomeAmount: number;
                previousExpenseAmount: number;
                previousBalanceAmount: number;
                incomeChangePercentage: number | null;
                expenseChangePercentage: number | null;
            };
        };
        CategoryTrends: {
            periods: components["schemas"]["CategoryTrendPeriod"][];
            categories: components["schemas"]["CategoryTrendCategory"][];
            availableCategories: components["schemas"]["CategoryTrendAvailableCategory"][];
            summary: components["schemas"]["CategoryTrendsSummary"];
        };
        CategoryTrendPeriod: {
            period: string;
            incomeAmount: number;
            expenseAmount: number;
            netAmount: number;
            actualAmount: number;
            recurringAmount: number;
        };
        CategoryTrendCategory: components["schemas"]["CategoryTrendAvailableCategory"] & {
            totalAmount: number;
            averageAmount: number;
            values: components["schemas"]["CategoryTrendValue"][];
            subcategories?: (components["schemas"]["CategoryTrendAvailableCategory"] & {
                totalAmount: number;
                averageAmount: number;
                values: components["schemas"]["CategoryTrendValue"][];
            })[];
            directCategory?: components["schemas"]["CategoryTrendAvailableCategory"] & {
                totalAmount: number;
                averageAmount: number;
                values: components["schemas"]["CategoryTrendValue"][];
            };
        };
        CategoryTrendValue: {
            period: string;
            actualAmount: number;
            recurringAmount: number;
            totalAmount: number;
            previousAmount: number;
            changeAmount: number;
            changePercentage: number | null;
            /** @enum {string} */
            changeKind: "increase" | "decrease" | "stable" | "started";
        };
        CategoryTrendAvailableCategory: {
            /** Format: uuid */
            categoryId: string;
            /** Format: uuid */
            parentId?: string | null;
            parentName?: string | null;
            isSystem?: boolean;
            name: string;
            icon: string | null;
            /** @enum {string} */
            type: "income" | "expense";
        };
        CategoryTrendsSummary: {
            periodCount: number;
            categoryCount: number;
            incomeAmount: number;
            expenseAmount: number;
            netAmount: number;
            actualAmount: number;
            recurringAmount: number;
            totalAmount: number;
            averageMonthlyIncomeAmount: number;
            averageMonthlyExpenseAmount: number;
            averageMonthlyNetAmount: number;
        };
        Commitments: {
            period: string;
            months: {
                period: string;
                installmentsAmount: number;
                recurringAmount: number;
                billsAmount: number;
                creditsAmount: number;
                committedAmount: number;
                incomeAmount: number;
                freeAmount: number;
                commitmentPercentage: number | null;
                /** @enum {string} */
                status: "healthy" | "attention" | "critical";
            }[];
            endingSeries: {
                /** Format: uuid */
                seriesId: string;
                name: string;
                endPeriod: string;
                monthlyAmount: number;
                remainingAmount: number;
            }[];
            relief: {
                period: string;
                previousPeriod: string;
                releasedAmount: number;
                percentage: number;
            } | null;
        };
        DashboardInstallmentExpenses: {
            period: string;
            items: {
                amount: number;
                categoryIcon: string | null;
                currentInstallment: number;
                endPeriod: string | null;
                isPaid: boolean;
                name: string;
                pendingAmount: number;
                pendingInstallmentCount: number;
                personAvatarUrl: string | null;
                personName: string;
                progressPercentage: number;
                /** Format: uuid */
                seriesId: string;
                totalInstallments: number;
            }[];
        };
        InstallmentsReport: {
            referencePeriod: string;
            monthlyHistory: {
                period: string;
                totalAmount: number;
                activePurchaseCount: number;
            }[];
            summary: components["schemas"]["InstallmentsSummary"];
            groups: components["schemas"]["InstallmentGroup"][];
        };
        InstallmentsSummary: {
            openSeriesCount: number;
            totalPendingAmount: number;
            dueInPeriodAmount: number;
            trackedAmount: number;
            paidInstallmentCount: number;
            pendingInstallmentCount: number;
            trackedInstallmentCount: number;
            untrackedInstallmentCount: number;
            missingInstallmentCount: number;
        };
        InstallmentGroup: {
            /** Format: uuid */
            seriesId: string;
            name: string;
            note: string | null;
            /** @enum {string} */
            paymentMethod: "credit_card" | "debit_card" | "pix" | "cash" | "boleto" | "benefits" | "bank_transfer";
            originalAmount: number;
            totalInstallments: number;
            trackedFromInstallment: number;
            trackedInstallmentCount: number;
            untrackedInstallmentCount: number;
            scheduledInstallmentCount: number;
            missingInstallmentCount: number;
            paidInstallmentCount: number;
            pendingInstallmentCount: number;
            trackedAmount: number;
            paidAmount: number;
            pendingAmount: number;
            progressPercentage: number;
            /** Format: date */
            nextDueDate: string | null;
            nextPeriod: string | null;
            endPeriod: string | null;
            /** @enum {string} */
            status: "open" | "completed" | "incomplete";
            /** Format: uuid */
            personId: string;
            personName: string;
            personAvatarUrl: string | null;
            /** Format: uuid */
            categoryId: string | null;
            categoryName: string | null;
            categoryIcon: string | null;
            /** Format: uuid */
            cardId: string | null;
            cardName: string | null;
            cardLogo: string | null;
            /** Format: uuid */
            accountId: string | null;
            accountName: string | null;
            accountLogo: string | null;
            installments: components["schemas"]["Installment"][];
        };
        Installment: {
            /** Format: uuid */
            id: string;
            installmentNumber: number;
            period: string;
            /** Format: date */
            purchaseDate: string;
            amount: number;
            /** Format: date */
            dueDate: string | null;
            /** @enum {string} */
            status: "paid" | "pending";
            isDueInReferencePeriod: boolean;
        };
        InstallmentQuote: {
            installmentCount: number;
            totalAmount: number;
        };
        QuoteInstallmentsInput: {
            installmentIds: string[];
        };
        InstallmentAnticipation: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            seriesId: string;
            targetPeriod: string;
            installmentCount: number;
            totalAmount: number;
            discount: number;
            finalAmount: number;
        };
        CreateInstallmentAnticipationInput: {
            installmentIds: string[];
            targetPeriod: string;
            /** @default 0 */
            discount: number;
        };
        InstallmentAnticipationDetails: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            seriesId: string;
            targetPeriod: string;
            discount: number;
            installments: {
                /** Format: uuid */
                id: string;
                installmentNumber: number;
                totalInstallments: number;
                amount: number;
                originalPeriod: string;
            }[];
        };
        UndoInstallmentAnticipation: {
            /** Format: uuid */
            id: string;
            restoredInstallmentCount: number;
            remainingInstallmentCount: number;
            restoredDiscount: number;
            remainingDiscount: number;
        };
        UndoInstallmentAnticipationInput: {
            installmentIds: string[];
        };
        SettingsSecurityOutput: {
            passwordChangeAvailable: boolean;
        };
        ResetSettingsOutput: {
            /** @enum {boolean} */
            reset: true;
        };
        ResetSettingsInput: {
            /** @enum {string} */
            confirmation: "ZERAR";
        };
        DeleteSettingsAccountOutput: {
            /** @enum {boolean} */
            deleted: true;
        };
        DeleteSettingsAccountInput: {
            /** @enum {string} */
            confirmation: "EXCLUIR";
        };
        UserPreferencesOutput: {
            /** @enum {string} */
            theme: "system" | "light" | "dark";
            hideValuesOnStart: boolean;
            /** @enum {string} */
            defaultPaymentMethod: "credit_card" | "debit_card" | "pix" | "cash" | "boleto" | "benefits" | "bank_transfer";
            /** Format: uuid */
            defaultAccountId: string | null;
            /** Format: uuid */
            defaultCardId: string | null;
            notificationDueSoonDays: 1 | 3 | 5 | 7;
            transactionsPageSize: 20 | 30 | 50;
            /** @enum {string} */
            mobileShortcut: "accounts" | "cards" | "budgets" | "goals" | "people" | "categories" | "notes" | "attachments" | "inbox";
            /** @enum {string} */
            startPage: "dashboard" | "transactions" | "accounts" | "cards" | "budgets" | "inbox";
        };
        UpdateUserPreferencesInput: {
            /** @enum {string} */
            theme?: "system" | "light" | "dark";
            hideValuesOnStart?: boolean;
            /** @enum {string} */
            defaultPaymentMethod?: "credit_card" | "debit_card" | "pix" | "cash" | "boleto" | "benefits" | "bank_transfer";
            /** Format: uuid */
            defaultAccountId?: string | null;
            /** Format: uuid */
            defaultCardId?: string | null;
            notificationDueSoonDays?: 1 | 3 | 5 | 7;
            transactionsPageSize?: 20 | 30 | 50;
            /** @enum {string} */
            mobileShortcut?: "accounts" | "cards" | "budgets" | "goals" | "people" | "categories" | "notes" | "attachments" | "inbox";
            /** @enum {string} */
            startPage?: "dashboard" | "transactions" | "accounts" | "cards" | "budgets" | "inbox";
        };
        DueDateRulesOutput: components["schemas"]["SaveDueDateRulesInput"] & Record<string, never>;
        SaveDueDateRulesInput: {
            revision: number;
            /** Format: date */
            effectiveFrom?: string;
            calendar: {
                workingWeekdays: number[];
                includeNationalHolidays: boolean;
                holidays: string[];
                /** @default [] */
                recurringHolidays: string[];
            };
            rules: {
                /** Format: uuid */
                id: string;
                name: string;
                /** @enum {string} */
                target: "payable" | "invoice";
                /** @enum {string} */
                scope: "all" | "selected";
                cardIds: string[];
                transactionIds: string[];
                seriesIds: string[];
                /** @enum {string} */
                adjustment: "next" | "previous" | "none";
                weekends: boolean;
                holidays: boolean;
            }[];
        };
        DeviceToken: {
            /** Format: uuid */
            id: string;
            name: string;
            tokenPrefix: string;
            /** Format: date-time */
            lastUsedAt: string | null;
            /** Format: date-time */
            expiresAt: string;
            expiresSoon: boolean;
            recentCaptureCount: number;
            /** Format: date-time */
            createdAt: string;
        };
        CreatedDeviceToken: components["schemas"]["DeviceToken"] & {
            token: string;
        };
        CreateDeviceTokenInput: {
            name: string;
        };
        InboxPage: {
            items: components["schemas"]["InboxItemSummary"][];
            sourceApps: string[];
            notificationDates: string[];
            counts: components["schemas"]["InboxStatusCounts"];
            page: number;
            pageSize: number;
            total: number;
            totalPages: number;
            pendingSummary: components["schemas"]["InboxPendingSummary"];
        };
        InboxItemSummary: {
            /** Format: uuid */
            id: string;
            sourceAppName: string | null;
            originalText: string;
            /** Format: date-time */
            notificationTimestamp: string;
            parsedName: string | null;
            parsedAmount: number | null;
            /** @enum {string} */
            status: "pending" | "processed" | "discarded";
            /** Format: uuid */
            transactionId: string | null;
            /** Format: date-time */
            processedAt: string | null;
            /** Format: date-time */
            discardedAt: string | null;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        InboxStatusCounts: {
            pending: number;
            processed: number;
            discarded: number;
        };
        InboxPendingSummary: {
            totalAmount: number;
            pendingCount: number;
            sources: {
                /** Format: uuid */
                id: string;
                /** @enum {string} */
                kind: "account" | "card";
                name: string;
                logo: string | null;
                amount: number;
                count: number;
            }[];
            unidentifiedAmount: number;
            unidentifiedCount: number;
        };
        InboxSnapshot: {
            pendingCount: number;
            recentItems: {
                /** Format: uuid */
                id: string;
                sourceAppName: string | null;
                parsedName: string | null;
                parsedAmount: number | null;
                /** Format: date-time */
                notificationTimestamp: string;
            }[];
        };
        InboxItem: components["schemas"]["InboxItemSummary"] & {
            sourceApp: string;
            originalTitle: string | null;
        };
        DiscardInboxItemsOutput: {
            discardedCount: number;
        };
        DiscardInboxItemsInput: {
            ids: string[];
        };
        ProcessInboxItemInput: {
            /** Format: uuid */
            transactionId: string;
        };
        ClearInboxItemsOutput: {
            /** @enum {string} */
            status: "processed" | "discarded";
            deletedCount: number;
        };
        InboxRulesList: {
            items: components["schemas"]["InboxRule"][];
            total: number;
        };
        InboxRule: {
            /** Format: uuid */
            id: string;
            name: string;
            priority: number;
            isActive: boolean;
            /** @enum {string} */
            matchMode: "all" | "any";
            conditions: components["schemas"]["InboxRuleCondition"][];
            category: {
                /** Format: uuid */
                id: string;
                name: string;
            } | null;
            person: {
                /** Format: uuid */
                id: string;
                name: string;
            } | null;
            version: number;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        InboxRuleCondition: {
            /** @enum {string} */
            field: "sourceApp" | "sourceAppName" | "originalTitle" | "originalText" | "parsedName";
            /** @enum {string} */
            operator: "contains" | "equals" | "startsWith" | "endsWith";
            value: string;
        } | {
            /** @enum {string} */
            field: "parsedAmount";
            /** @enum {string} */
            operator: "equals" | "greaterThan" | "lessThan";
            value: number;
        };
        CreateInboxRuleInput: {
            name: string;
            priority: number;
            isActive: boolean;
            /** @enum {string} */
            matchMode: "all" | "any";
            conditions: components["schemas"]["InboxRuleCondition"][];
            /** Format: uuid */
            categoryId: string | null;
            /** Format: uuid */
            personId: string | null;
        };
        InboxRuleSuggestion: {
            /** Format: uuid */
            categoryId: string | null;
            /** Format: uuid */
            personId: string | null;
            appliedRules: {
                /** Format: uuid */
                id: string;
                name: string;
                fields: ("categoryId" | "personId")[];
            }[];
        };
        ReplaceInboxRuleInput: {
            name: string;
            priority: number;
            isActive: boolean;
            /** @enum {string} */
            matchMode: "all" | "any";
            conditions: components["schemas"]["InboxRuleCondition"][];
            /** Format: uuid */
            categoryId: string | null;
            /** Format: uuid */
            personId: string | null;
            expectedVersion: number;
        };
        SetInboxRuleActiveInput: {
            expectedVersion: number;
            isActive: boolean;
        };
        Notifications: {
            items: components["schemas"]["Notification"][];
            unreadCount: number;
            activeCount: number;
            archivedCount: number;
            /** Format: date-time */
            generatedAt: string;
        };
        Notification: {
            notificationKey: string;
            fingerprint: string;
            /** @enum {string} */
            severity: "critical" | "warning" | "info";
            canArchive: boolean;
            isRead: boolean;
            isArchived: boolean;
            /** Format: date-time */
            readAt: string | null;
            /** Format: date-time */
            archivedAt: string | null;
            /** @enum {string} */
            kind: "bill";
            billId: string;
            name: string;
            categoryIcon: string | null;
            amount: number;
            /** Format: date */
            dueDate: string;
            period: string;
            /** @enum {string} */
            status: "overdue" | "dueSoon";
        } | {
            notificationKey: string;
            fingerprint: string;
            /** @enum {string} */
            severity: "critical" | "warning" | "info";
            canArchive: boolean;
            isRead: boolean;
            isArchived: boolean;
            /** Format: date-time */
            readAt: string | null;
            /** Format: date-time */
            archivedAt: string | null;
            /** @enum {string} */
            kind: "invoice";
            /** Format: uuid */
            cardId: string;
            cardName: string;
            cardLogo: string | null;
            remainingAmount: number;
            /** Format: date */
            dueDate: string;
            period: string;
            /** @enum {string} */
            status: "overdue" | "dueSoon";
        } | {
            notificationKey: string;
            fingerprint: string;
            /** @enum {string} */
            severity: "critical" | "warning" | "info";
            canArchive: boolean;
            isRead: boolean;
            isArchived: boolean;
            /** Format: date-time */
            readAt: string | null;
            /** Format: date-time */
            archivedAt: string | null;
            /** @enum {string} */
            kind: "budget";
            /** Format: uuid */
            budgetId: string;
            categoryName: string;
            categoryIcon: string | null;
            budgetAmount: number;
            committedAmount: number;
            usagePercentage: number;
            period: string;
            /** @enum {string} */
            status: "warning" | "reached" | "exceeded";
        } | {
            notificationKey: string;
            fingerprint: string;
            /** @enum {string} */
            severity: "critical" | "warning" | "info";
            canArchive: boolean;
            isRead: boolean;
            isArchived: boolean;
            /** Format: date-time */
            readAt: string | null;
            /** Format: date-time */
            archivedAt: string | null;
            /** @enum {string} */
            kind: "inbox";
            pendingCount: number;
            /** Format: date-time */
            latestItemAt: string;
        } | {
            notificationKey: string;
            fingerprint: string;
            /** @enum {string} */
            severity: "critical" | "warning" | "info";
            canArchive: boolean;
            isRead: boolean;
            isArchived: boolean;
            /** Format: date-time */
            readAt: string | null;
            /** Format: date-time */
            archivedAt: string | null;
            /** @enum {string} */
            kind: "externalExpenses";
            pendingCount: number;
            totalAmount: number;
            counterpartCount: number;
            latestCounterpartName: string;
            period: string;
            /** Format: date-time */
            latestUpdatedAt: string;
            /** @enum {string} */
            action: "import";
        } | {
            notificationKey: string;
            fingerprint: string;
            /** @enum {string} */
            severity: "critical" | "warning" | "info";
            canArchive: boolean;
            isRead: boolean;
            isArchived: boolean;
            /** Format: date-time */
            readAt: string | null;
            /** Format: date-time */
            archivedAt: string | null;
            /** @enum {string} */
            kind: "task";
            /** Format: uuid */
            noteId: string;
            title: string;
            /** Format: date */
            dueDate: string;
            /** @enum {string} */
            status: "overdue" | "dueSoon";
        };
        UpdateNotificationStateInput: {
            fingerprint: string;
            isRead?: boolean;
            isArchived?: boolean;
        };
        Releases: {
            currentVersion: components["schemas"]["SemanticVersion"];
            latestVersion: components["schemas"]["SemanticVersion"] & unknown;
            updateAvailable: boolean;
            hasUnseenCurrentRelease: boolean;
            /** Format: uri */
            releasesUrl: string;
            /** Format: uri */
            latestReleaseUrl: string | null;
            releases: {
                version: components["schemas"]["SemanticVersion"];
                /** Format: date */
                date: string;
                summary: string;
                isCurrent: boolean;
                sections: {
                    /** @enum {string} */
                    type: "added" | "changed" | "deprecated" | "removed" | "fixed" | "security";
                    items: string[];
                }[];
                upgradeNotes?: string[];
            }[];
        };
        SemanticVersion: string;
        MarkReleaseSeenOutput: {
            version: components["schemas"]["SemanticVersion"];
            /** @enum {boolean} */
            hasUnseenCurrentRelease: false;
        };
        MarkReleaseSeenInput: {
            /** @enum {boolean} */
            seen: true;
        };
        CompanionInboxAccepted: {
            /** Format: uuid */
            id: string;
            clientId: string | null;
            message: string;
        };
        CompanionInboxError: {
            error: string;
        };
        CompanionInboxItemInput: {
            sourceApp: string;
            sourceAppName?: string | null;
            originalTitle?: string | null;
            originalText: string;
            /** Format: date-time */
            notificationTimestamp: string;
            /** @enum {number} */
            timestampFormatVersion?: 2;
            parsedName?: string | null;
            parsedAmount?: number | null;
            clientId?: string | null;
        };
        CompanionInboxBatch: {
            message: string;
            total: number;
            success: number;
            failed: number;
            results: components["schemas"]["CompanionInboxBatchResult"][];
        };
        CompanionInboxBatchResult: {
            clientId: string | null;
            /** Format: uuid */
            serverId: string | null;
            success: boolean;
            error: string | null;
        };
        CompanionInboxBatchInput: {
            items: components["schemas"]["CompanionInboxItemInput"][];
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export type operations = Record<string, never>;
