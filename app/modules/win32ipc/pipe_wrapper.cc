#include "pipe_wrapper.h"

#include <windows.h>

#undef IN
#undef OUT

namespace pipe_wrapper {

result<pipe> create_pipe(pipe_direction direction) {
    char const* err_msg;

    switch (direction) {
    case pipe_direction::IN:
    case pipe_direction::OUT:
        break;
    default:
        return result<pipe>::error("unknown pipe direction");
    }

    SECURITY_ATTRIBUTES sec_attr;
    sec_attr.nLength = sizeof(SECURITY_ATTRIBUTES);
    sec_attr.bInheritHandle = TRUE;
    sec_attr.lpSecurityDescriptor = NULL;

    HANDLE h_rd = NULL;
    HANDLE h_wr = NULL;

    if (!CreatePipe(&h_rd, &h_wr, &sec_attr, 0)) {
        err_msg = "CreatePipe";
        goto err;
    }

    auto uninherited_end = h_rd;
    if (direction == pipe_direction::OUT) {
        uninherited_end = h_wr;
    }
    if (!SetHandleInformation(uninherited_end, HANDLE_FLAG_INHERIT, 0)) {
        err_msg = "SetHandleInformation";
        goto err_close_handles;
    }

    return result<pipe>::ok(pipe{(uintptr_t)h_rd, (uintptr_t)h_wr});

err_close_handles:
    CloseHandle(h_rd);
    CloseHandle(h_wr);
err:
    return result<pipe>::error(err_msg);
}
    
} // namespace pipe_wrapper
