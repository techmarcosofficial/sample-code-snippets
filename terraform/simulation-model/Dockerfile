# lambda base image for Docker from AWS
FROM public.ecr.aws/lambda/python:3.10

## Install OS packages for Pillow-SIMD
#RUN yum -y install tar gzip zlib freetype-devel \
#    gcc \
#    ghostscript \
#    lcms2-devel \
#    libffi-devel \
#    libimagequant-devel \
#    libjpeg-devel \
#    libraqm-devel \
#    libtiff-devel \
#    libwebp-devel \
#    make \
#    openjpeg2-devel \
#    rh-python36 \
#    rh-python36-python-virtualenv \
#    sudo \
#    tcl-devel \
#    tk-devel \
#    tkinter \
#    which \
#    xorg-x11-server-Xvfb \
#    zlib-devel \
#    && yum clean all

# copy requirements.txt
COPY requirements.txt ./requirements.txt

# install packages
# RUN pip3 install -r requirements.txt --target "${LAMBDA_TASK_ROOT}"
RUN python3.10 -m pip install --no-cache-dir -r requirements.txt

# Replace Pillow with Pillow-SIMD to take advantage of AVX2
#RUN pip uninstall -y pillow && CC="cc -mavx2" pip install -U --force-reinstall pillow-simd

# copy all code and lambda handler
# COPY . ${LAMBDA_TASK_ROOT}
#COPY ./deeplearning_model_v2.h5 ./deeplearning_model_v2.h5

COPY ./app.py ./


# run lambda handler
CMD ["app.lambda_handler"]