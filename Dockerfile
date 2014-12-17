FROM node

RUN npm install -g a11y

ENTRYPOINT ["a11y"]
CMD ["--help"]
