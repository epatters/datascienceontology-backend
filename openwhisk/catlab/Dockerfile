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

ENV JULIA_PATH /usr/local/julia
ENV JULIA_VERSION 0.6.0

RUN mkdir $JULIA_PATH \
	&& apt-get update && apt-get install -y curl \
	&& curl -sSL "https://julialang-s3.julialang.org/bin/linux/x64/${JULIA_VERSION%[.-]*}/julia-${JULIA_VERSION}-linux-x86_64.tar.gz" -o julia.tar.gz \
	&& curl -sSL "https://julialang-s3.julialang.org/bin/linux/x64/${JULIA_VERSION%[.-]*}/julia-${JULIA_VERSION}-linux-x86_64.tar.gz.asc" -o julia.tar.gz.asc \
	&& export GNUPGHOME="$(mktemp -d)" \
# http://julialang.org/juliareleases.asc
# Julia (Binary signing key) <buildbot@julialang.org>
	&& gpg --keyserver ha.pool.sks-keyservers.net --recv-keys 3673DF529D9049477F76B37566E3C7DC03D6E495 \
	&& gpg --batch --verify julia.tar.gz.asc julia.tar.gz \
	&& rm -r "$GNUPGHOME" julia.tar.gz.asc \
	&& tar -xzf julia.tar.gz -C $JULIA_PATH --strip-components 1 \
	&& rm -rf /var/lib/apt/lists/* julia.tar.gz*

ENV PATH $JULIA_PATH/bin:$PATH

######################################################################
# Catlab
######################################################################

ENV CATLAB_VERSION a6674303a3f5cfaed94ac70807ffa2e39f26d36a

RUN julia -e 'Pkg.add("JSON"); Pkg.clone("https://github.com/epatters/Catlab.git")' \
  && cd /root/.julia/v${JULIA_VERSION%[.-]*}/Catlab \
  && git checkout ${CATLAB_VERSION} . \
  # Precompile packages
  && julia -e 'import JSON; import Catlab' \
  && rm -rf /root/.julia/v${JULIA_VERSION%[.-]*}/METADATA

######################################################################

RUN mkdir -p /actionProxy
ADD actionproxy.py /actionProxy/

RUN mkdir -p /action
ADD action.jl /action/exec
RUN chmod +x /action/exec

CMD ["/bin/bash", "-c", "cd actionProxy && python -u actionproxy.py"]
