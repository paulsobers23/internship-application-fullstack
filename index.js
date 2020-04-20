addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});
/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  const apiUrls = await chooseRandom();
  console.log(apiUrls);
  const response = await fetch(apiUrls);

  const html = new HTMLRewriter()
    .on('title', new ElementRewriter("Paul's Website"))
    .on('h1#title', new ElementRewriter('Paul'))
    .on('p#description', new ElementRewriter('Check out my github'))
    .on('a#url', new ElementRewriter('https://github.com/paulsobers23'))
    .transform(response);
  const doc = await html.text();
  return new Response(doc, {
    headers: { 'Content-type': 'text/html' },
  });
}
// Responsible for making a request and returning the data needed
const getVariants = async () => {
  const url = 'https://cfw-takehome.developers.workers.dev/api/variants';
  const response = await fetch(url);
  const data = await response.json();
  console.log(data.variants);
  return data.variants;
};
// Responsible for choosing random variant url
const chooseRandom = async () => {
  const urls = await getVariants();
  const randomIndex = Math.floor(Math.random() * urls.length);
  return urls[randomIndex];
};

class ElementRewriter {
  constructor(content, attribute = '') {
    this.content = content;
    this.attribute = attribute;
  }

  element(element) {
    if (this.attribute) {
      element.setAttribute(this.attribute, this.content);
    } else {
      element.setInnerContent(this.content);
    }
  }
}
