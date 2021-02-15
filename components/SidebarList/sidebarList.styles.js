import { css } from '@emotion/react';

export const container = css`
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

export const label = css`
  font-size: 1.4rem;
  font-weight: 400;
  margin-bottom: 1rem;
  margin-top: 1rem;
  padding-left: 1.5rem;
`;

export const listContainer = css`
  flex: 1;
  position: relative;

  @media (max-width: 768px) {
    margin-top: 3.5rem;
  }
`;

export const list = css`
  height: 100%;
  list-style: none;
  left: 0;
  margin: 0;
  overflow-y: auto;
  padding: 0;
  position: absolute;
  top: 0;
  width: 100%;
`;