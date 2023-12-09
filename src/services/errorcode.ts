export default class ErrorCode {
    static readonly SUCCESS_CODE = 200_00;

    // bad request family
    static readonly BAD_REQUEST_ERROR = 400_00
    static readonly INVALID_REQUEST_ARGUMENT_ERROR = 400_01
    static readonly REQUIRED_ARG_IS_NULL_ERROR = 400_02
    static readonly CANNOT_LOGIN_ERROR = 400_03

    // unauthorized family
    static readonly UNAUTHORIZED_ERROR = 401_00
    static readonly INVALID_TOKEN_ERROR = 401_01

    // refuse family
    static readonly REFUSE_ACCESS_ERROR = 403_00

    // # not found family
    static readonly NOT_FOUND_ERROR = 404_00

    // # duplicated family
    static readonly DUPLICATED_ERROR = 409_00
}
