#include <node.h>
#include <v8.h>
#include <cstring>

#include "pipe_wrapper.h"

void CreatePipe(v8::FunctionCallbackInfo<v8::Value> const& args) {
    auto isolate = v8::Isolate::GetCurrent();
    
    if (args.Length() != 1) {
        isolate->ThrowException(v8::Exception::TypeError(
            v8::String::NewFromUtf8(isolate, "Wrong number of arguments")));
        return;
    }
    if (!args[0]->IsString()) {
        isolate->ThrowException(v8::Exception::TypeError(
            v8::String::NewFromUtf8(isolate, "Argument type error")));
        return;
    }

    pipe_wrapper::pipe_direction direction;

    v8::String::Utf8Value const arg0(args[0]->ToString());
    if (arg0.length() == 2 && !std::strcmp("in", *arg0)) {
        direction = pipe_wrapper::pipe_direction::IN;
    } else if (arg0.length() == 3 && !std::strcmp("out", *arg0)) {
        direction = pipe_wrapper::pipe_direction::OUT;
    } else {
        isolate->ThrowException(v8::Exception::Error(
            v8::String::NewFromUtf8(isolate, "Unknown pipe direction, must " \
                "be 'in' or 'out'")));
        return;
    }

    auto const pipe_result = pipe_wrapper::create_pipe(direction);
    if (pipe_result.err_msg != nullptr) {
        isolate->ThrowException(v8::Exception::Error(
            v8::String::NewFromUtf8(isolate, pipe_result.err_msg)));
        return;
    }
    auto& pipe = pipe_result.value;

    // TODO: needs a workaround. fds as strings?
    if ((uintptr_t)(double)pipe.read_end_handle != pipe.read_end_handle ||
        (uintptr_t)(double)pipe.write_end_handle != pipe.write_end_handle) {
        isolate->ThrowException(v8::Exception::Error(
            v8::String::NewFromUtf8(isolate, "Handle is too large for double")));
        return;
    }

    auto obj = v8::Object::New(isolate);
    obj->Set(v8::String::NewFromUtf8(isolate, "readEnd"),
        v8::Number::New(isolate, (double)pipe.read_end_handle));
    obj->Set(v8::String::NewFromUtf8(isolate, "writeEnd"),
        v8::Number::New(isolate, (double)pipe.write_end_handle));
    args.GetReturnValue().Set(obj);
}

void Init(v8::Handle<v8::Object> exports) {
    auto isolate = v8::Isolate::GetCurrent();
    exports->Set(v8::String::NewFromUtf8(isolate, "createPipe"),
        v8::FunctionTemplate::New(isolate, CreatePipe)->GetFunction());
}

NODE_MODULE(win32ipc, Init)
