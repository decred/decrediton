{
  "targets": [
    {
      "target_name": "dcrwin32ipc",
      "sources": [],
      "conditions": [
        ["OS=='win'", {"sources": ["module.cc", "pipe_wrapper.cc"]}]
      ]
    }
  ]
}
