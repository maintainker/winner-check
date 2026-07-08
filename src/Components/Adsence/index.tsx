declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export default function AdsenseBanner() {
  return (
    <div className="w-full h-[100px] min-h-[100px] max-h-[100px] clear-both overflow-hidden block">
      <ins
        className="adsbygoogle"
        style={{ display: "inline-block", width: "100%", height: "100px" }}
        data-ad-client="ca-pub-5291227946947481"
        data-ad-slot="6867020055"
        data-ad-format="horizontal"
        data-full-width-responsive="false"
        data-full-height-responsive="false"
      ></ins>
    </div>
  );
}
