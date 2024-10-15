import styled from '@emotion/styled'

import React from 'react'

import { Product } from '../ProductDetailsSlice'
import { ProductDetailsProps } from '../ProductDetailsUi'

type CarouselProps = ProductDetailsProps & {
  product: Product
}

export class CarouselUi extends React.Component<CarouselProps> {
  render(): React.ReactNode {
    return (
      <Carousel data-testid='product-gallery'>
        <Thumbnails>
          {this.props.product.imageGallery.map(
            image => (
              <ThumbnailWrapper
                key={image}
                onClick={() => this.props.selectImage(image)}
                className={image === this.props.product.selectedImage ? 'selected' : ''}
              >
                <Thumbnail
                  src={image}
                  alt={this.props.product.name}
                />
              </ThumbnailWrapper>
            )
          )}
        </Thumbnails>

        <LargeImageContainer>
          <LargeImage
            src={this.props.product.selectedImage}
            alt={this.props.product.name}
          />

          <PrevButton
            onClick={() => this.props.goToPrevImage()}
          >
            <CarouselButtonImage src="/assets/prev.svg" />
          </PrevButton>

          <NextButton
            onClick={() => this.props.goToNextImage()}
          >
            <CarouselButtonImage src="/assets/next.svg" />
          </NextButton>
        </LargeImageContainer>
      </Carousel>
    )
  }
}

const Carousel = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 5%;

  width: 50%;
  max-height: 70vh;
  height: 30rem;
`

const Thumbnails = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  width: 15%;
  height: 100%;
  overflow-y: auto;
`

const ThumbnailWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 20%;

  cursor: pointer;

  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    &::after {
      content: '';

      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;

      background-color: rgba(186, 186, 186, 0.167);
    }
  }

  &.selected {
    &::after {
      content: '';

      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;

      box-shadow: inset 0 0 0 1px #1D1F22;
    }
  }
`

const Thumbnail = styled.img`
  width: 100%;
`

const LargeImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`

const LargeImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`

const PrevButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 1rem;

  width: 2rem;
  height: 2rem;
  border: none;
  padding: 0.5rem;

  background-color: rgb(0, 0, 0, 0.73);

  cursor: pointer;
  transform: translateY(-50%);

  &:hover {
    background-color: rgb(0, 0, 0, 0.82);
  }
`

const NextButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 50%;
  right: 1rem;
  
  width: 2rem;
  height: 2rem;
  border: none;
  padding: 0.5rem;
  
  background-color: rgb(0, 0, 0, 0.73);
  
  cursor: pointer;
  transform: translateY(-50%);
  
  &:hover {
    background-color: rgb(0, 0, 0, 0.82);
  }
  `
  
const CarouselButtonImage = styled.img`
  width: 100%;
  height: 100%;
`
