<template>
    <label class="el-checkbox">
        <span class="el-checkbox-input">
            <span class="el-checkbox-inner"
                  :class="{
                    'is-disabled': disabled,
                    'is-checked': isChecked,
                    'is-indeterminate': indeterminate,
                    'is-focus': focus }">
            </span>
            <input v-if="trueLabel || falseLabel"
                   class="el-checkbox-original"
                   :true-value="trueLabel"
                   :false-value="falseLabel"
                   :name="name"
                   :disabled="disabled"
                   v-model="_value"
                   type="checkbox"
                   @focus="focus = true"
                   @blur="focus = false"
                   @change="$emit('change',$event)">
            <input v-else
                   class="el-checkbox-original"
                   type="checkbox"
                   :value="label"
                   :name="name"
                   :disabled="disabled"
                   v-model="_value"
                   @focus="focus = true"
                   @blur="focus = false"
                   @change="$emit('change',$event)">
        </span>
        <span class="el-checkbox-label" v-if="$slots.default || label">
            <slot></slot>
            <template v-if="!$slots.default">{{label}}</template>
        </span>
    </label>
</template>
<script>
    import Emitter from '../../util/emitter';

    export default {
        name: 'ElCheckbox',

        mixins: [Emitter],

        props: {
            value: {},
            label: String,
            indeterminate: Boolean,
            disabled: Boolean,
            checked: Boolean,
            name: String,
            trueLabel: [String, Number],
            falseLabel: [String, Number]
        },

        computed: {
            _value: {
                get() {
                    return this.value !== undefined ? this.value : this.$parent.value;
                },
                set(newValue) {
                    if (!this.wrapInGroup) {
                        this.$emit('input', newValue);
                    } else {
                        this.$parent.$emit('input', newValue);
                    }
                }
            },

            isChecked() {
                var type = Object.prototype.toString.call(this._value);

                if (type === '[object Boolean]') {
                    return this._value;
                } else if (type === '[object Array]') {
                    return this._value.indexOf(this.label) > -1;
                } else if (type === '[object String]' || type === '[object Number]') {
                    return this._value === this.trueLabel;
                }
            }
        },

        data() {
            return {
                focus: false,
                wrapInGroup: this.$parent.$options.componentName === 'ElCheckboxGroup'
            };
        },

        watch: {
            checked: {
                immediate: true,
                handler(value) {
                    if (value) {
                        let type = Object.prototype.toString.call(this._value);
                        if (type !== '[object Array]') {
                            this._value = this.trueLabel || true;
                        } else {
                            this._value.push(this.label);
                        }
                    }
                }
            }
        },
        methods:{
            handleChange(ev){
                this.$emit('change',ev);
            }
        }
    };
</script>
