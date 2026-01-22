{
  description = "Decrediton dev environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-25.11";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            bun
            nodejs_20
            python311
            cmake
          ];
          LD_LIBRARY_PATH = pkgs.lib.makeLibraryPath (
            with pkgs;
            [
              alsa-lib
              atk
              cairo
              cups
              dbus
              expat
              gdk-pixbuf
              glib
              gtk3
              libdrm
              libgbm
              libGL
              libxkbcommon
              mesa
              nspr
              nss
              pango
              stdenv.cc.cc.lib
              xorg.libX11
              xorg.libXcomposite
              xorg.libXdamage
              xorg.libXext
              xorg.libXfixes
              xorg.libXrandr
              xorg.libxcb
            ]
          );
        };
      }
    );
}
