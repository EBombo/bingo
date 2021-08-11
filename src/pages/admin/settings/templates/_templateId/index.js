import React, {useEffect, useRef, useState} from "reactn";
import {Anchor} from "../../../../../components/form/Anchor";
import {Input} from "../../../../../components/form/Input";
import get from "lodash/get";
import EmailEditor from "react-email-editor";
import {ButtonAnt} from "../../../../../components/form/Button";
import {templatesLegend} from "../../../../../components/common/DataList";
import {object, string} from "yup";
import {useForm} from "react-hook-form";
import {firestore} from "../../../../../firebase";
import styled from "styled-components";

export const TemplateContainer = props => {
    const EmailEditorRef = useRef(null);
    const [isSaving, setIsSaving] = useState(false);

    const schema = object().shape({
        subject: string().required()
    });

    const {errors, handleSubmit, register} = useForm({
        validationSchema: schema,
        reValidateMode: "onSubmit",
    });

    useEffect(() => {
        if (!get(EmailEditorRef, "current.editor") || !get(props, "currentTemplate.design")) return;

        EmailEditorRef.current.editor.loadDesign(get(props, "currentTemplate.design", {}));
    }, [EmailEditorRef, props.currentTemplate]);

    const saveContent = async (data) => {
        setIsSaving(true);

        const exportHtml = await new Promise(resolve =>
            EmailEditorRef.current.editor.exportHtml(data => resolve({html: data.html, design: data.design}))
        );

        await saveTemplate({content: exportHtml.html, design: exportHtml.design, subject: data.subject});
    };

    const saveTemplate = async (data) => {
        try {
            console.log(data)
            await firestore
                .doc(`settings/templates`)
                .set({
                    ...props.templates,
                    [props.currentTemplate.id]: {
                        ...props.currentTemplate,
                        design: data.design,
                        content: data.content,
                        subject: data.subject,
                    },
                });

            props.showNotification("SUCCESS", "Se guardo corectamente", "success");
        } catch (error) {
            console.log(error);
            props.showNotification("ERROR", "Algo salio mal");
        }

        setIsSaving(false);
        props.setCurrentTemplate(null);
    };

    return <TemplateContainerCss>
        <Anchor onClick={() => props.setCurrentTemplate(null)}
                variant="primary">
            Volver
        </Anchor>
        <div className="name">{props.currentTemplate.name}</div>
        <div className="to">Destinatario: {props.currentTemplate.to}</div>
        <form onSubmit={handleSubmit(saveContent)}>
            <Input type="text"
                   name="subject"
                   label="Asunto"
                   variant="primary"
                   placeholder="Asunto"
                   ref={register}
                   error={errors.subject}
                   defaultValue={get(props, "currentTemplate.subject", "")}/>
            <EmailEditor ref={EmailEditorRef}
                         options={{
                             supportedDisplayModes: ['web', 'email'],
                             id: "editor-container",
                             displayMode: "web",
                             features: {
                                 userUploads: false
                             },
                             appearance: {
                                 theme: "dark",
                             }
                         }}/>
            <ButtonAnt
                margin="1rem 0"
                variant="primary"
                htmlType="submit"
                loading={isSaving}
                disabled={isSaving}>
                Guardar cambios
            </ButtonAnt>
        </form>
        <div className="legend">
            <div className="subtitle">Leyenda:</div>
            <div className="description">
                Utiliza las siguientes variables y seran reemplazadas por la
                informacion correspondiente
            </div>
            <ol>
                {
                    templatesLegend
                        .map((legend) =>
                            <li className="lengend-content"
                                key={legend.value}>
                                <div className="legend-value">{legend.value}:</div>
                                <div className="legend-name">{`{{${legend.name}}}`}</div>
                            </li>
                        )
                }
            </ol>
        </div>
    </TemplateContainerCss>
};

const TemplateContainerCss = styled.div`
  .name {
    margin: 1rem 0;
    font-size: 18px;
    line-height: 22px;
  }

  .to {
    margin: 1rem 0;
    font-size: 14px;
    line-height: 16px;
  }

  .legend {
    margin: 1rem 0;
    border-radius: 5px;
    background: ${(props) => props.theme.basic.grayLight};
    display: flex;
    flex-direction: column;
    padding: 1rem;

    .subtitle {
      color: ${(props) => props.theme.basic.primary};
      font-size: 12px;
      line-height: 13px;
      margin: 5px 0;
    }

    .description {
      color: ${(props) => props.theme.basic.primary};
      font-size: 13px;
      line-height: 12px;
      margin: 5px 0;
    }

    ol {
      -webkit-columns: 2;
      -moz-columns: 2;
      columns: 2;

      li {
        list-style-position: inside;
        display: flex;
        align-items: center;
        font-size: 14px;
        -webkit-column-break-inside: avoid;
        page-break-inside: avoid;
        break-inside: avoid;

        .legend-value {
          margin-right: 5px;
          color: ${(props) => props.theme.basic.whiteDarken};
        }

        .legend-name {
          color: ${(props) => props.theme.basic.white};
        }
      }
    }
  }
`;
