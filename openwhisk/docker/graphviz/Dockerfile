# Dockerfile for docker skeleton (useful for running blackbox binaries, scripts, or Python 3 actions) .
FROM python:3.6-alpine

# Upgrade and install basic Python dependencies.
RUN apk add --no-cache bash \
 && apk add --no-cache --virtual .build-deps \
        bzip2-dev \
        gcc \
        libc-dev \
  && pip install --upgrade pip setuptools six \
  && pip install --no-cache-dir gevent==1.2.1 flask==0.12 \
  && apk del .build-deps

# Install Graphviz
# We need the latest version 2.40 (with JSON output formats), which is only
# available on edge. We get warnings about glibc but graphviz seems to work.
RUN apk add graphviz --no-cache \
  --repository http://dl-cdn.alpinelinux.org/alpine/edge/main/

ENV FLASK_PROXY_PORT 8080

RUN mkdir -p /actionProxy
ADD actionproxy.py /actionProxy/

RUN mkdir -p /action
ADD action.py /action/exec
RUN chmod +x /action/exec

CMD ["/bin/bash", "-c", "cd actionProxy && python -u actionproxy.py"]
