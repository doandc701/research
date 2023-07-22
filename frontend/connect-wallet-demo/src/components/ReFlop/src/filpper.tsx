import { defineComponent, ref } from "vue";
import { propTypes } from "/@/utils/propTypes";
import "./filpper.css";

const props = {
  // front paper text
  // Front card text
  frontText: propTypes.number.def(0),
  // back paper text
  // back card text
  backText: propTypes.number.def(1),
  // flipping duration, please be consistent with the CSS animation-duration value.
  // Flop animation time, consistent with animation-duration set in CSS
  duration: propTypes.number.def(600)
};

export default defineComponent({
  name: "ReFlop",
  props,
  setup(props) {
    // eslint-disable-next-line vue/no-setup-props-destructure
    const { frontText, backText, duration } = props;
    const isFlipping = ref(false);
    const flipType = ref("down");
    const frontTextFromData = ref(frontText);
    const backTextFromData = ref(backText);

    const textClass = (number: number) => {
      return "number" + number;
    };

    const flip = (type: string, front: number, back: number) => {
      // If in rollover, do not execute
      if (isFlipping.value) return false;
      frontTextFromData.value = front;
      backTextFromData.value = back;
      // Set the flip direction according to the passed type
      flipType.value = type;
      // Set rollover state to true
      isFlipping.value = true;

      setTimeout(() => {
        // Set rollover state to false
        isFlipping.value = false;
        frontTextFromData.value = back;
      }, duration);
    };

    // down flop
    const flipDown = (front: any, back: any): void => {
      flip("down", front, back);
    };

    // flop
    const flipUp = (front: any, back: any): void => {
      flip("up", front, back);
    };

    // Set front card text
    function setFront(text: number): void {
      frontTextFromData.value = text;
    }

    // Set back card text
    const setBack = (text: number): void => {
      backTextFromData.value = text;
    };

    return {
      flipType,
      isFlipping,
      frontTextFromData,
      backTextFromData,
      textClass,
      flipDown,
      flipUp,
      setFront,
      setBack
    };
  },

  render() {
    const main = `m-flipper ${this.flipType} ${this.isFlipping ? "go" : ""}`;
    const front = `digital front ${this.textClass(this.frontTextFromData)}`;
    const back = `digital back ${this.textClass(this.backTextFromData)}`;
    return (
      <div class={main}>
        <div class={front} />
        <div class={back} />
      </div>
    );
  }
});
