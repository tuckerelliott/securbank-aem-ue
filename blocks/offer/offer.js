/* eslint-disable no-underscore-dangle */
export default async function decorate(block) {
  const aempublishurl = 'https://publish-p99452-e916802.adobeaemcloud.com';
  const aemauthorurl = 'https://author-p99452-e916802.adobeaemcloud.com';
  const persistedquery = '/graphql/execute.json/securbank/OfferByPath';
  const offerpath = block.querySelector(':scope div:nth-child(1) > div a').innerHTML.trim();
  const variationname = block.querySelector(':scope div:nth-child(2) > div').innerHTML.trim();

  const url = window.location && window.location.origin && window.location.origin.includes('author')
    ? `${aemauthorurl}${persistedquery};path=${offerpath};variation=${variationname};ts=${Math.random() * 1000}`
    : `${aempublishurl}${persistedquery};path=${offerpath};variation=${variationname};ts=${Math.random() * 1000}`;
  const options = { credentials: 'include' };

  // console.log(url); //https://author-p123917-e1220159.adobeaemcloud.com/graphql/execute.json/securbank/OfferByPath;path=/content/dam/securbank/en/offers/997;variation=main;ts=172.03956935404463

  const cfReq = await fetch(url, options)
    .then((response) => response.json())
    .then((contentfragment) => {
      let offer = '';
      if (contentfragment.data) {
        offer = contentfragment.data.offerByPath.item;
      }
      return offer;
    });

  const itemId = `urn:aemconnection:${offerpath}/jcr:content/data/master`;

  block.innerHTML = `
  <div class='banner-content' data-aue-resource=${itemId} data-aue-type="reference" data-aue-filter="cf">
      <div data-aue-prop="heroImage" data-aue-type="media" class='banner-detail' style="background-image: linear-gradient(90deg,rgba(0,0,0,0.6), rgba(0,0,0,0.1) 80%) ,url(${aempublishurl + cfReq.heroImage._dynamicUrl});">
          <p data-aue-prop="headline" data-aue-type="text" class='pretitle'>${cfReq.headline}</p>
          <p data-aue-prop="pretitle" data-aue-type="text" class='headline'>${cfReq.pretitle}</p>
          <p data-aue-prop="detail" data-aue-type="richtext" class='detail'>${cfReq.detail.plaintext}</p>
      </div>
      <div class='banner-logo'>
      </div>
  </div>
`;
}
