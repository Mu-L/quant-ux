
<template>
  <div class="MatcShareDialog" @keydown.stop @keyup.stop @keypress.stop>
    <LanguagePicker @change="setLanguage"  :hasLabel="true"/>
    <div class="form-group MatcShareRow">
      <label>Test</label>
      <input type="text" class="form-control" :value="testLink" @focus="select" />
      <a class="MatcShareIcon" :href="testLink" target="_QuantUXTest">
        <QIcon icon="Share"/>
      </a>
    </div>

    <div class="form-group MatcShareRow">
      <label>Share and Comment</label>
      <input type="text" class="form-control" :value="shareLink" @focus="select" />
      <a class="MatcShareIcon" :href="shareLink" target="_QuantUXShare">
        <QIcon icon="Share"/>
      </a>
    </div>

    <div class="form-group  MatcShareRow">
      <label>Low-Code Token</label>
      <input type="text" class="form-control" :value="`${hash}`" @focus="select" ref="hashInput" />
      <a class="MatcShareIcon" @click="copy" target="_QuantUXShare">
        <QIcon icon="Copy"/>
      </a>
    </div>

    <div class="MatcMarginTopL MatcShareRow form-group">
      <CheckBox v-model="doNotStore" label="Do not store test data" />
    </div>

    <div class="MatcMarginTop MatcShareRow MatcSharePasswordRow" v-if="hasPassword">
      <CheckBox v-model="needPassword" label="Require Password" />
      <input
        type="text"
        class="form-control password-control"
        :value="`${password}`"
        @focus="select"
        ref="passwordInput"
        v-if="needPassword"
      />
    </div>
  </div>
</template>

<style lang="scss">
  @import "../style/share.scss";
</style>



<style scoped>
.MatcSharePasswordRow {
  display: flex;
  justify-content: space-between;
  height: 50px;
}

.MatcSharePasswordRow .VommondCheckBoxWrapper {
  width: 250px;
}

.password-control {
  display: inline-block;
  margin-left: 100px;
  flex-grow: 1;
}
</style>
<script>
import DojoWidget from "dojo/DojoWidget";
import CheckBox from "common/CheckBox";
import LanguagePicker from "page/LanguagePicker";
import QIcon from "page/QIcon";

export default {
  name: "ShareForm",
  mixins: [DojoWidget],
  data: function() {
    return {
      isPublic: false,
      needPassword: false,
      hasPassword: false,
      language: 'en',
      doNotStore: false,
      languageOptions: [
        {value: 'en', label: 'English'},
        {value: 'de', label: 'German'},
        {value: 'pt', label: 'Portuguese'},
        {value: 'cn', label: 'Chinese'}
      ],
      invitation: "--- Loading ---"
    };
  },
  components: {
    'CheckBox': CheckBox,
    'LanguagePicker': LanguagePicker,
    'QIcon': QIcon
  },
  computed: {
    base() {
      return location.protocol + "//" + location.host;
    },
    password() {
      if (this.needPassword) {
        let password = this.invitation.substring(this.invitation.length - 8);
        return password;
      }
      return "";
    },
    hash() {
      return this.invitation;
    },
    passwortedHash() {
      if (this.needPassword) {
        return this.invitation.substring(0, this.invitation.length - 8);
      }
      return this.invitation;
    },
    testLink() {
      let testURL = this.base + "/#/test.html?h=" + this.passwortedHash;
      console.debug('testLink', this.doNotStore)
      if (this.isPublic || this.doNotStore) {
        testURL += "&log=false";
      }
      if (this.language) {
         testURL += "&ln=" + this.language;
      }
      console.debug(testURL)
      return testURL;
    },
    shareLink() {
      let testURL = this.base + "/#/share.html?h=" + this.hash;
      if (this.isPublic) {
        testURL += "&log=false";
      }
      return testURL;
    }
  },
  methods: {
    setLanguage (ln) {
      this.language = ln
    },
    setInvitation(inv) {
      this.invitation = inv;
    },
    setPublic(p) {
      this.isPublic = p;
    },
    copy() {
      this.$refs.hashInput.select();
      document.execCommand("copy");
      this.showSuccess("Copied to clipboard");
    },
    copyPassword() {
      this.$refs.passwordInput.select();
      document.execCommand("copy");
      this.showSuccess("Copied to clipboard");
    },
    select(e) {
      if (e.target) {
        e.target.select();
        document.execCommand("copy");
        this.showSuccess("Copied to clipboard");
      }
    }
  },
  mounted() {}
};
</script>