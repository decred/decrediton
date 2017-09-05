{
  "targets": [
    {
      "target_name": "win32ipc",
      "conditions": [
        ['OS=="win"', {"sources": [ "module.cc", "pipe_wrapper.cc" ]},{"sources": []}],
      ]
  ]
}
