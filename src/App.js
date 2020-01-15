import React from 'react';
import './App.css';

import { Remarkable } from 'remarkable';
import carousel from './../src/carousel'
const md = new Remarkable({ html: true, xhtmlOut: true });
md.use(carousel)
const markdown = `
# Carousel

<carousel>
  ![Cantina de Crasto](https://i.imgur.com/qqlXnif.jpg "Cantina do Crasto")
</carousel>

# Image
![Cantina de Crasto](https://i.imgur.com/qqlXnif.jpg "Cantina do Crasto")


wadduheck

**hehehe** tudo bem?
`
const html = md.render(markdown)

function App() {

  const markdownHTML = {
    __html:  html
  }


  return (
    <div className="App">
      <div
        className="content"
        dangerouslySetInnerHTML={markdownHTML}
      />
    </div>
  );
}

export default App;
