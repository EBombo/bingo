import React, {useEffect, useState} from "reactn";
import styled from "styled-components";
import get from "lodash/get";
import {Anchor} from "../../../../components/form/Anchor";
import {emailTemplates} from "../../../../components/common/DataList";
import {firestore} from "../../../../firebase";
import {spinLoader} from "../../../../components/common/loader";
import {TemplateContainer} from "./_templateId";

export const TemplatesContainer = props => {
    const [isLoading, setIsLoading] = useState(true);
    const [currentTemplate, setCurrentTemplate] = useState(null);
    const [templates, setTemplates] = useState(null);

    useEffect(() => {
        const fetchSettingsEmails = () =>
            firestore
                .doc(`settings/templates`)
                .onSnapshot(snapshot => {
                    setTemplates(snapshot.data());
                    setIsLoading(false);
                });

        const unSub = fetchSettingsEmails();
        return () => unSub();
    }, []);

    if (isLoading) return spinLoader();

    return <TemplatesContainerCss>
        {
            currentTemplate
                ? <TemplateContainer {...props}
                                     templates={templates}
                                     currentTemplate={currentTemplate}
                                     setCurrentTemplate={setCurrentTemplate}/>
                : <div className="main-container">
                    {
                        emailTemplates
                            .map(template =>
                                <div key={template.id}>
                                    {template.name}&nbsp;
                                    <Anchor variant="primary"
                                            onClick={() => setCurrentTemplate(get(templates, `${template.id}`, template))}>
                                        [EDITAR]
                                    </Anchor>
                                </div>
                            )
                    }
                </div>
        }
    </TemplatesContainerCss>;
};

const TemplatesContainerCss = styled.div`
  margin: auto;
  padding: 10px;
  width: 100%;
  color: ${props => props.theme.basic.primary};

  .ant-list-vertical {
    .ant-list-item-action {
      margin: 0 0 1rem;
    }
  }
`;
