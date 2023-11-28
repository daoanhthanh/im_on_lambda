docker run \
  --rm -it \
  --platform linux/arm64/v8 \
  -v $(pwd):/root/result \
  arm64v8/amazonlinux:2023

yum install -y git gcc gcc-c++ cpp cpio make cmake automake autoconf \
  chkconfig clang clang-libs dos2unix zlib zlib-devel zip unzip tar perl libxml2 bzip2 bzip2-libs xz xz-libs pkgconfig libtool \
  libpng.aarch64 libjpeg-turbo.aarch64 libwebp.aarch64

# libjpeg-turbo
cd /root
curl https://github.com/libjpeg-turbo/libjpeg-turbo/archive/refs/tags/3.0.1.tar.gz -L -o tmp-libjpeg-turbo.tar.gz
tar xf tmp-libjpeg-turbo.tar.gz
cd libjpeg-turbo*
cmake -G"Unix Makefiles" -DCMAKE_INSTALL_PREFIX=/root/build/cache -DCMAKE_BUILD_TYPE=Release -DENABLE_STATIC=TRUE -DENABLE_SHARED=FALSE -DWITH_JPEG8=TRUE .
make clean
make all
make install

# libjpeg
cd /root
curl https://github.com/winlibs/libjpeg/archive/refs/tags/libjpeg-9c.tar.gz -L -o tmp-libjpeg.tar.gz
tar xf tmp-libjpeg.tar.gz
cd libjpeg-lib*

dos2unix *
dos2unix -f configure
chmod +x configure

PKG_CONFIG_PATH=/root/build/cache/lib/pkgconfig \
  ./configure \
  CPPFLAGS=-I/root/build/cache/include \
  LDFLAGS=-L/root/build/cache/lib \
  --disable-dependency-tracking \
  --disable-shared \
  --enable-static \
  --prefix=/root/build/cache

dos2unix -f libtool

make
make install

# libpng
cd /root
curl https://github.com/glennrp/libpng/archive/refs/tags/v1.6.40.tar.gz -L -o tmp-libpng.tar.gz
tar xf tmp-libpng.tar.gz

PKG_CONFIG_PATH=/root/build/cache/lib/pkgconfig \
  ./configure \
  CPPFLAGS=-I/root/build/cache/include \
  LDFLAGS=-L/root/build/cache/lib \
  --disable-dependency-tracking \
  --disable-shared \
  --enable-static \
  --prefix=/root/build/cache

make
make install

# Step 5: Build ImageMagick on Amazon Linux 2
cd /root
curl https://github.com/ImageMagick/ImageMagick/archive/refs/tags/7.1.1-21.tar.gz -L -o tmp-imagemagick.tar.gz
tar xf tmp-imagemagick.tar.gz
cd ImageMagick*

PKG_CONFIG_PATH=/root/build/cache/lib/pkgconfig \
  ./configure \
  CPPFLAGS=-I/root/build/cache/include \
  LDFLAGS="-L/root/build/cache/lib -lstdc++" \
  --disable-dependency-tracking \
  --disable-shared \
  --enable-static \
  --prefix=/root/result \
  --enable-delegate-build \
  --disable-installed \
  --without-modules \
  --disable-docs \
  --without-magick-plus-plus \
  --without-perl \
  --without-x \
  --disable-openmp

make clean
make all
make install
