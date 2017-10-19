FROM python:3.6

# Upgrade and install basic Python dependencies.
RUN apt-get update \
  && apt-get install bash \
  && pip install --upgrade pip setuptools six \
  && pip install --no-cache-dir gevent==1.2.1 flask==0.12

ENV FLASK_PROXY_PORT 8080

######################################################################
# Julia
######################################################################

# Copied from official Julia repo on Docker Hub:
# https://github.com/docker-library/julia/blob/ef0fdf96ba90c0020776bca367cb838910aca339/Dockerfile

ENV JULIA_MAJOR=0.6 JULIA_VERSION=0.6.0
ENV JULIA_PATH=/usr/local/julia JULIA_PKGDIR=/action/julia

RUN mkdir $JULIA_PATH \
	&& apt-get update && apt-get install -y curl \
	&& curl -sSL "https://julialang-s3.julialang.org/bin/linux/x64/${JULIA_VERSION%[.-]*}/julia-${JULIA_VERSION}-linux-x86_64.tar.gz" -o julia.tar.gz \
	&& curl -sSL "https://julialang-s3.julialang.org/bin/linux/x64/${JULIA_VERSION%[.-]*}/julia-${JULIA_VERSION}-linux-x86_64.tar.gz.asc" -o julia.tar.gz.asc \
	&& export GNUPGHOME="$(mktemp -d)" \
	&& gpg --keyserver ha.pool.sks-keyservers.net --recv-keys 3673DF529D9049477F76B37566E3C7DC03D6E495 \
	&& gpg --batch --verify julia.tar.gz.asc julia.tar.gz \
	&& rm -r "$GNUPGHOME" julia.tar.gz.asc \
	&& tar -xzf julia.tar.gz -C $JULIA_PATH --strip-components 1 \
	&& rm -rf /var/lib/apt/lists/* julia.tar.gz*

ENV PATH $JULIA_PATH/bin:$PATH

######################################################################
# Catlab
######################################################################

ENV CATLAB_VERSION 78fca5cf7194d9267e4f51a17cc8075d95ffea5b

RUN julia -e 'Pkg.init(); Pkg.clone("https://github.com/epatters/Catlab.git"); \
    Pkg.add("HTTP"); Pkg.add("JSON")' \
  && cd ${JULIA_PKGDIR}/v${JULIA_MAJOR}/Catlab \
  && git checkout ${CATLAB_VERSION}

COPY build/OpenDiscCore ${JULIA_PKGDIR}/v${JULIA_MAJOR}/OpenDiscCore

# Precompile packages to improve start time.
RUN julia -e 'import Catlab; import OpenDiscCore'

######################################################################

RUN mkdir -p /actionProxy
COPY actionproxy.py /actionProxy/

RUN mkdir -p /action
COPY stub.sh /action/exec
RUN chmod +x /action/exec

CMD ["/bin/bash", "-c", "cd actionProxy && python -u actionproxy.py"]
