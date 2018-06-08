export class rpxProcess {

  constructor(private cog: any) { }

  private rePx: RegExp = /(\d+(\.\d+)?)(px)?/;

  private rePxAll: RegExp = /(\d+(\.\d+)?)px/g;

  /**
   * 换px转换成rpx
   * 
   * @private
   * @param {string} pxStr 
   */
  private pxToRpx(pxStr: string) {
      const px = parseFloat(pxStr);
      let rpxValue: number | string = +(px * (750 / this.cog.baswWidth)).toFixed(this.cog.fixedDigits);
      if (this.cog.autoRemovePrefixZero) {
          if (rpxValue.toString().startsWith('0.'))
              rpxValue = rpxValue.toString().substring(1);
      }
      return { px: pxStr, pxValue: px, rpxValue, rpx: rpxValue + 'rpx'  };
  }

  /**
   * px转rpx for all
   * 
   * @param {string} text 需要转换文本，例如：10px 12p
   * @return {Object} {px, pxValue, rpx, rpxValue }
   */
  convert(text: string) {
      let match = text.match(this.rePx);
      if (!match) return null;

      return this.pxToRpx(match[1]);
  }

  /** 批量转换 */
  convertAll(code: string): string {
      if (!code) return code;

      return code.replace(this.rePxAll, (word: string) => {
          const res = this.pxToRpx(word);
          if (res) return res.rpx;
          return word;
      });

  }
}
