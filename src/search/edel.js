const fetch = require("node-fetch");

module.exports = async (req, res) => {
  const search = await req.params.search;
  const raw = `&selop_507=eq&jhselop_507=G9DjnUpsEkqwO4dgoPAe6Q3tBdUfSjf7TPGaVOt1CIw=&txt_507=&txt_507_to=&txt_241=&txt_241_to=&txt_269=&txt_269_to=&txt_275=&txt_275_to=&selop_286=eq&jhselop_286=G9DjnUpsEkqGz32$$KHplvNPxwjFP+6$$ZlCuUD+X2m4Az225Phv7Grw==&txt_286=&txt_286_to=&selop_279=eq&jhselop_279=G9DjnUpsEkqwO4dgoPAe6Q3tBdUfSjf7TPGaVOt1CIw=&txt_279=&txt_279_to=&selop_285=eq&jhselop_285=G9DjnUpsEkqwO4dgoPAe6Q3tBdUfSjf7TPGaVOt1CIw=&txt_285=&txt_285_to=&selop_287=eq&jhselop_287=G9DjnUpsEkqGz32$$KHplvNPxwjFP+6$$ZlCuUD+X2m4Az225Phv7Grw==&txt_287=&txt_287_to=&selop_309=eq&jhselop_309=G9DjnUpsEkqGz32$$KHplvNPxwjFP+6$$ZlCuUD+X2m4Az225Phv7Grw==&txts_309=&txts_309_to=&selop_308=eq&jhselop_308=G9DjnUpsEkqGz32$$KHplvNPxwjFP+6$$ZlCuUD+X2m4Az225Phv7Grw==&txts_308=&txts_308_to=&txtReportId=84&txtpageNo=1&txtModuleName=Auction&txtsize=10&txtparam1=403&txtparam2=%2B05%3A30&txtparam3=103&txtparam4=N&txtparam5=&txtparam6=&txtparam7=0&txtparam8=&txtparam9=&txtparam10=${search}&txtsortColumn=&txtsortOrder=&txtTab=`;
  const headers = {
    Connection: "keep-alive",
    Pragma: "no-cache",
    "Cache-Control": "no-cache",
    "sec-ch-ua":
      '"Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"',
    Accept: "text/plain, */*; q=0.01",
    DNT: "1",
    "X-Requested-With": "XMLHttpRequest",
    "sec-ch-ua-mobile": "?0",
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_1_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36",
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    Origin: "https://edelweissarc.auctiontiger.net",
    "Sec-Fetch-Site": "same-origin",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Dest": "empty",
    Referer: "https://edelweissarc.auctiontiger.net/EPROC/",
    "Accept-Language": "en-US,en;q=0.9,hi;q=0.8",
    Cookie:
      'JSESSIONID=FF35D65040FE691AC82C86EEA4BC72C5.tomcat2; locale=1; moduleId=5; isShowDcBanner=1; listingStyle=1; logo=Edelweiss.png; theme=theme-1; dateFormat=DD/MM/YYYY; conversionValue=103; eprocLogoName=2; phoneNo=9265562818/9265562821/9374519754; email="support@auctiontiger.net"; showCompanyLogo=1; JSESSIONID=1B0D3B8ADE27DACE1606D89D976A5517.tomcat2; JSESSIONID=855DBD8560CEE29C266AE0DFC9CD23C4.tomcat2',
  };

  const requestOptions = {
    method: "POST",
    headers: headers,
    body: raw,
    redirect: "follow",
  };

  fetch(
    "https://edelweissarc.auctiontiger.net/EPROC/reportgenerator/GetReportDetails?1=1&reportId=84",
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => {
      console.log(result);
      res.status(200).send({
        status: true,
        html: result,
      });
    })
    .catch((error) => console.log("error", error));
};
