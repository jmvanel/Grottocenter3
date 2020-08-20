import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Fade } from '@material-ui/core';
import { includes } from 'ramda';

import { DocumentFormContext } from '../Provider';
import DescriptionEditor from '../formElements/DescriptionEditor';
import DocumentTypeSelect from '../formElements/DocumentTypeSelect';
import LanguageSelect from '../formElements/LanguageSelect';
import PublicationDatePicker from '../formElements/PublicationDatePicker';
import TitleEditor from '../formElements/TitleEditor';

import {
  allDocumentTypes,
  isCollection,
  isCollectionElement,
  isUnknown,
} from '../DocumentTypesHelper';

// ===================================
const FlexWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const FlexItemWrapper = styled.div`
  flex: 1;
`;

const TitleEditorWrapper = styled.div`
  flex: 8;
  flex-basis: 600px;
`;

const PublicationDateWrapper = styled.div`
  flex: 1;
  flex-basis: 350px;
`;

const DocumentForm = ({ allLanguages, stepId }) => {
  const {
    docAttributes: { documentType },
    validatedSteps,
  } = useContext(DocumentFormContext);

  /**
   * Performance improvement to avoid useless re-rendering
   * Step1 needs to re-render only if :
   * - it becomes valid
   * - the DocumentType changes
   */
  const memoizedValues = [documentType, includes(stepId, validatedSteps)];
  return useMemo(
    () => (
      <>
        <FlexWrapper>
          <FlexItemWrapper>
            <DocumentTypeSelect
              allDocumentTypes={allDocumentTypes}
              helperText="For example, a magazine is a Collection, an article from a magazine is a Collection Element."
              required
            />
          </FlexItemWrapper>
          <FlexItemWrapper>
            <LanguageSelect
              allLanguages={allLanguages}
              itemReferringTo="Document Main"
              helperText="Main language of the document"
              contextValueNameToUpdate="documentMainLanguage"
            />
          </FlexItemWrapper>
        </FlexWrapper>

        <Fade in={!isUnknown(documentType)}>
          <div>
            {!isUnknown(isUnknown) && (
              <>
                <FlexWrapper>
                  <TitleEditorWrapper>
                    <TitleEditor
                      allLanguages={allLanguages}
                      languageHelperText="Language of the title and the description."
                      languageItemReferringTo="Title and description"
                      required
                    />
                  </TitleEditorWrapper>
                  {!isCollection(documentType) && (
                    <PublicationDateWrapper>
                      <PublicationDatePicker
                        required={isCollectionElement(documentType)}
                      />
                    </PublicationDateWrapper>
                  )}
                </FlexWrapper>

                <DescriptionEditor allLanguages={allLanguages} required />
              </>
            )}
          </div>
        </Fade>
      </>
    ),
    memoizedValues,
  );
};

DocumentForm.propTypes = {
  allLanguages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  stepId: PropTypes.number.isRequired,
};

export default DocumentForm;
