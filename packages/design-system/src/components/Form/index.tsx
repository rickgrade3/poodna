import { head } from "lodash";
import React, { ReactElement, useContext, useEffect, useState } from "react";
import tw, { css, styled, theme } from "twin.macro";
import { Avatar, Button, MenuItem } from "../..";
import Input from "../Input/Input";
import { LayourBaseProps, X, Y } from "../Layout/Layout";
import Typography, { TypographyProps } from "../Typography/Typography";
type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;

interface Base<F> {
  label?: string;
  widthPercent?: number;
  placeholder?: string;
  required?: boolean;
  disabed?: (d: F) => boolean;
  hidden?: (d: F) => boolean;
  field?: keyof F;
}
/*
   Text or default
*/

interface FormItem_TEXT<F> extends Base<F> {
  component: "TEXT";
  value: (d: F) => Promise<string | number | null | undefined>;
}
/*
   LABEL or default
*/

interface FormItem_LABEL<F> extends Base<F> {
  component: "LABEL";
  value: (d: F) => Promise<string | null | undefined>;
}
/*
   Number
*/

interface FormItem_NUMBER_SLIDER<F> extends Base<F> {
  component: "NUMBER_SLIDER";
  value: (d: F) => Promise<string | number | null | undefined>;
}
/*
    Multiselect
*/
interface ItemEl {
  decoration?: string | number | ReactElement | null | undefined;
  label?: string | number | null | undefined;
  value: string | number | null | undefined;
}

interface FormItem_MULTI_SELECT_ITEM<F> extends Base<F> {
  component: "MULTI_SELECT_ITEM";
  choices: (d: F) => Promise<ItemEl[]>;
  value: (d: F, choices?: ItemEl[]) => Promise<ItemEl[]>;
}

interface FormItem_MULTI_SELECT_ITEM_HOOK<F> extends Base<F> {
  component: "MULTI_SELECT_ITEM_HOOK";
  choices: (d: F) => { data: ItemEl[] };
  value: (d: F, choices?: ItemEl[]) => Promise<ItemEl[]>;
}
interface FormItem_AVATAR_SELCTOR<F> extends Base<F> {
  component: "AVATAR_SELCTOR";
  choices?: (d: F) => Promise<ItemEl[]> | false;
  value: (d: F, choices?: ItemEl[]) => Promise<ItemEl>;
}

interface FormItem_YES_NO<F> extends Base<F> {
  component: "YES_NO";
  value: (d: F) => Promise<boolean>;
}

type StepItem<F> =
  | FormItem_TEXT<F>
  | FormItem_LABEL<F>
  | FormItem_AVATAR_SELCTOR<F>
  | FormItem_NUMBER_SLIDER<F>
  | FormItem_MULTI_SELECT_ITEM<F>
  | FormItem_MULTI_SELECT_ITEM_HOOK<F>
  | FormItem_YES_NO<F>
  | string;

type FormButton<F> = {
  text?: string;
  onClick?: (d: F) => Promise<boolean>;
  disabled?: (d: F) => boolean;
  hidden?: (d: F) => boolean;
};

type FormValidate<F> = (d: F) => boolean;
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<T>;
type Header =
  | string
  | Optional<TypographyProps, "variant" | "size">
  | ReactElement;
type FormProps<F> = {
  initialValue: F;
  variant?: LayourBaseProps["variant"];
  ctaFloating?: boolean;
  steps: StepItem<F>[][];
  submit?: FormButton<F>;
  cancel?: FormButton<F>;
  back?: FormButton<F>;
  next?: FormButton<F>;
  validate?: FormValidate<F>;
  header?: Header;
  headers?: Header[];
  loading?: boolean;
  children?: React.ReactElement;
};

function Form<F>() {
  interface T_FORM_ContextValue
    extends Omit<FormProps<F>, "children">,
      ReturnType<typeof useFormState> {}
  const TFormContext = React.createContext<T_FORM_ContextValue | undefined>(
    undefined
  );
  const useFormState = (p: FormProps<F>) => {
    const [form, setForm] = useState<F | undefined>(p.initialValue);
    const [step, setStep] = useState<number>(0);
    return { form: form, setForm, step, setStep };
  };
  const useForm = () => {
    const c = useContext(TFormContext);
    if (!c) {
      throw "Error";
    }
    return c;
  };

  const BackButton = () => {
    const c = useForm();
    return (
      <Button
        onClick={async () => {
          c.setStep(c.step - 1);
          if (c.back?.onClick) await c.back.onClick(c.form);
        }}
      >
        {c.back?.text || "Back"}
      </Button>
    );
  };
  const SubmitButton = () => {
    const c = useForm();
    return (
      <Button
        size="xl"
        variant="primary"
        onClick={async () => {
          if (c.submit?.onClick) await c.submit.onClick(c.form);
        }}
      >
        {c.submit?.text || "Submit"}
      </Button>
    );
  };
  const NextButton = () => {
    const c = useForm();
    return (
      <Button
        size="xl"
        variant="primary"
        onClick={async () => {
          c.setStep(c.step + 1);
          if (c.next?.onClick) await c.next?.onClick(c.form);
        }}
      >
        {c.next?.text || "Next"}
      </Button>
    );
  };
  const CancelButton = () => {
    const c = useForm();
    return (
      <Button
        onClick={async () => {
          if (c.cancel?.onClick) await c.cancel.onClick(c.form);
        }}
      >
        {c.cancel?.text || "Cancel"}
      </Button>
    );
  };
  const FormItem_TEXT_EL = (p: FormItem_TEXT<F> & T_FORM_ContextValue) => {
    const [rd, setRd] = useState<boolean>(false);
    const [_v, setV] = useState<string | number>("");
    useEffect(() => {
      p.value(p.form).then((v) => {
        setV(v);
        setRd(true);
      });
    }, []);
    useEffect(() => {
      if (rd) {
        p.setForm({
          ...p.form,
          [p.field]: _v,
        });
      }
    }, [_v]);

    return (
      <Input
        label={p.label || p.field?.toString() || ""}
        onChange={(v) => {
          setV(v);
        }}
        disabled={!rd || (p && p.disabed && p.disabed(p.form))}
        loading={p.loading}
        value={_v}
        type="text"
      />
    );
  };
  const FormItem_LABEL_EL = (p: FormItem_LABEL<F> & T_FORM_ContextValue) => {
    const [rd, setRd] = useState<boolean>(false);
    const [_v, setV] = useState<string | number>("");
    useEffect(() => {
      setRd(false);
      p.value(p.form).then((v) => {
        setV(v);
        setRd(true);
      });
    }, []);
    return <div>{_v}</div>;
  };
  const FormItem_NUMBER_SLIDER_EL = (
    p: FormItem_NUMBER_SLIDER<F> & T_FORM_ContextValue
  ) => {
    const [rd, setRd] = useState<boolean>(false);
    const [_v, setV] = useState<string | number>("");
    useEffect(() => {
      setRd(false);
      p.value(p.form).then((v) => {
        setV(v);
        setRd(true);
      });
    }, []);
    useEffect(() => {
      if (rd) {
        p.setForm({
          ...p.form,
          [p.field]: _v,
        });
      }
    }, [_v]);
    return (
      <X justify={"start"} py={1} style={{ overflow: "auto" }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
          return (
            <Button
              variant={num === _v ? "ghost" : "ghost_dim"}
              onClick={async () => {
                setV(num);
              }}
            >
              {num}
            </Button>
          );
        })}
      </X>
    );
  };

  const FormItem_MULTI_SELECT_ITEM_EL = (
    p: FormItem_MULTI_SELECT_ITEM<F> & T_FORM_ContextValue
  ) => {
    const [rd, setRd] = useState<boolean>(false);
    const [choices, setChoices] = useState<
      ThenArg<ReturnType<typeof p.choices>>
    >([]);
    const [_v, setV] = useState<ThenArg<ReturnType<typeof p.choices>>>([]);
    useEffect(() => {
      setRd(false);
      Promise.all([p.choices(p.form), p.value(p.form)]).then(([v1, v2]) => {
        console.log("v1", v1);
        setChoices(v1);
        setV(v2);
        setRd(true);
      });
    }, []);
    useEffect(() => {
      if (rd) {
        p.setForm({
          ...p.form,
          [p.field]: _v.map((v) => v.value),
        });
      }
    }, [_v]);
    return (
      <Y>
        {choices.map((c) => {
          const checked = !!_v.find((_c) => _c.value === c.value);
          return (
            <MenuItem
              checked={checked}
              before={c.decoration}
              onClick={() => {
                if (!checked) {
                  setV([..._v, c]);
                } else {
                  setV(_v.filter((x) => x.value !== c.value));
                }
              }}
            >
              {c.label}
            </MenuItem>
          );
        })}
      </Y>
    );
  };

  const FormItem_MULTI_SELECT_ITEM_HOOK_EL = (
    p: FormItem_MULTI_SELECT_ITEM_HOOK<F> & T_FORM_ContextValue
  ) => {
    const [rd, setRd] = useState<boolean>(false);
    const { data: choices } = p.choices(p.form);
    const [_v, setV] = useState<ReturnType<typeof p.choices>["data"]>([]);
    useEffect(() => {
      setRd(false);
      Promise.all([p.value(p.form)]).then(([v2]) => {
        setV(v2);
        setRd(true);
      });
    }, []);
    useEffect(() => {
      if (rd) {
        p.setForm({
          ...p.form,
          [p.field]: _v.map((v) => v.value),
        });
      }
    }, [_v]);
    return (
      <Y>
        {choices.map((c) => {
          const checked = !!_v.find((_c) => _c.value === c.value);
          return (
            <MenuItem
              checked={checked}
              before={c.decoration}
              onClick={() => {
                if (!checked) {
                  setV([..._v, c]);
                } else {
                  setV(_v.filter((x) => x.value !== c.value));
                }
              }}
            >
              {c.label}
            </MenuItem>
          );
        })}
      </Y>
    );
  };

  const FormItem_YES_NO_EL = (p: FormItem_YES_NO<F> & T_FORM_ContextValue) => {
    const [rd, setRd] = useState<boolean>(false);
    const [_v, setV] = useState<boolean>(false);
    useEffect(() => {
      setRd(false);
      p.value(p.form).then((v) => {
        setV(v);
        setRd(true);
      });
    }, []);
    useEffect(() => {
      if (rd) {
        p.setForm({
          ...p.form,
          [p.field]: _v,
        });
      }
    }, [_v]);
    return (
      <X>
        <Button
          variant={true === _v ? "ghost" : "ghost_dim"}
          onClick={async () => {
            setV(true);
          }}
        >
          Yes
        </Button>
        <Button
          variant={false === _v ? "ghost" : "ghost_dim"}
          onClick={async () => {
            setV(false);
          }}
        >
          No
        </Button>
      </X>
    );
  };
  const FormItem_AVATAR_SELCTOR_EL = (
    p: FormItem_AVATAR_SELCTOR<F> & T_FORM_ContextValue
  ) => {
    const AVATARS = [
      "https://images.unsplash.com/photo-1618767628748-283b5a308f1d?ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyfHx8ZW58MHx8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1618827718822-98fae761b7b4?ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzfHx8ZW58MHx8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    ];
    const [rd, setRd] = useState<boolean>(false);

    const [_v, setV] = useState<
      ThenArg<ReturnType<typeof p.value>> | undefined
    >();
    useEffect(() => {
      setRd(false);
      Promise.all([p.value(p.form)]).then(([v1, v2]) => {
        setV(v1);
        setRd(true);
      });
    }, []);
    useEffect(() => {
      if (rd) {
        p.setForm({
          ...p.form,
          [p.field]: _v?.value,
        });
      }
    }, [_v]);
    return (
      <X>
        {AVATARS.map((c) => {
          const actived = c === (_v && _v.value);
          return (
            <div
              onClick={() => {
                setV({ value: c });
              }}
            >
              <Avatar active={actived} src={c}></Avatar>
            </div>
          );
        })}
      </X>
    );
  };
  const TForm: React.FC<FormProps<F>> = (p) => {
    const { back, submit, cancel, steps, header, headers } = p;
    const { children, ...pp } = p;
    const k = useFormState(p);
    const vv = { ...k, ...pp };
    const _header = headers?.[k.step] || header;
    let h = <></>;
    if (_header) {
      if (typeof _header === "string") {
        h = (
          <Typography
            {...{
              variant: "heading",
              size: "text_3xl",
              ...{ children: _header },
            }}
          />
        );
      } else if (React.isValidElement(_header)) {
        h = _header;
      } else {
        h = (
          <Typography
            {...{
              variant: "heading",
              size: "text_3xl",
              children: _header,
            }}
          />
        );
      }
    }

    return (
      <TFormContext.Provider value={vv}>
        <Y
          variant={p.variant || ["box", "light", "rounded", "shadow"]}
          gap={10}
        >
          {(_header || back) && (
            <div>
              {back && <BackButton />}
              {_header && h}
            </div>
          )}
          {children}
          <div
            css={css`
              * + .form-item-LABEL {
                margin-top: 1rem;
                margin-bottom: 0.5rem;
              }
            `}
            className="grid grid-cols-12 gap-2"
          >
            {steps[k.step] &&
              steps[k.step].map((s, index) => {
                let ch = <>TODO</>;
                let size = "12";
                let component = "LABEL";
                if (typeof s !== "string" && s.widthPercent) {
                  const percent = parseInt(s.widthPercent.toString());
                  size = Math.round((percent / 100) * 12).toString();
                }
                if (typeof s !== "string") {
                  component = s.component;
                }

                if (typeof s === "string") {
                  ch = (
                    <FormItem_LABEL_EL
                      {...{
                        ...{ component: "LABEL", value: async () => s },
                        ...vv,
                      }}
                    />
                  );
                } else if (s.component === "LABEL") {
                  ch = <FormItem_LABEL_EL {...{ ...s, ...vv }} />;
                } else if (s.component === "NUMBER_SLIDER") {
                  ch = <FormItem_NUMBER_SLIDER_EL {...{ ...s, ...vv }} />;
                } else if (s.component === "MULTI_SELECT_ITEM") {
                  ch = <FormItem_MULTI_SELECT_ITEM_EL {...{ ...s, ...vv }} />;
                } else if (s.component === "MULTI_SELECT_ITEM_HOOK") {
                  ch = (
                    <FormItem_MULTI_SELECT_ITEM_HOOK_EL {...{ ...s, ...vv }} />
                  );
                } else if (s.component === "YES_NO") {
                  ch = <FormItem_YES_NO_EL {...{ ...s, ...vv }} />;
                } else if (s.component === "AVATAR_SELCTOR") {
                  ch = <FormItem_AVATAR_SELCTOR_EL {...{ ...s, ...vv }} />;
                } else {
                  //DEFAULT COMPONENT`
                  ch = <FormItem_TEXT_EL {...{ ...s, ...vv }} />;
                }
                return (
                  <div
                    className={`form-item form-item-${component} col-span-${size}`}
                    key={index}
                  >
                    {ch}
                  </div>
                );
              })}
          </div>
          <Y>
            {cancel && k.step === 0 && <CancelButton />}
            {k.step > 0 && <BackButton />}
            {k.step !== steps.length - 1 && <NextButton />}
            {submit && k.step === steps.length - 1 && <SubmitButton />}
          </Y>
        </Y>
      </TFormContext.Provider>
    );
  };
  return { Form: TForm, useForm };
}

export default Form;
