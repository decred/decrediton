{
  "targets": [
    {
      "target_name": "win32ipc",
      "sources": [],
      "conditions": [
        ["OS=='win'", {"sources": ["module.cc", "pipe_wrapper.cc"]}]
      ]
    }
  ]
}
