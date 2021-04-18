import React, { useEffect, useState } from "react";
import tw, { css, styled, theme } from "twin.macro";
import { Button } from "../..";
import { X } from "../Layout/Layout";
import { Theme } from "../types";

import _ from "lodash";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export interface PaginationProps {
  totalItem: number;
  currentPage: number;
  pageCount: number;
  onChange: (start: number, end: number) => void;
  tone?: Theme;
}

export default ({ tone = "LIGHT", ...props }: PaginationProps) => {
  const totalPage = Math.ceil(props.totalItem / props.pageCount);
  const numbers = Array.from(Array(totalPage).keys());
  const groups = _.chunk(numbers, props.pageCount);
  const [currentPage, setCurrentPage] = useState(props.currentPage);

  const [idx, setIdx] = useState(
    _.indexOf(
      groups,
      _.find(groups, (nums) => {
        return nums.indexOf(currentPage) >= 0;
      })
    )
  );
  let showed = numbers.slice(
    idx * props.pageCount,
    idx * props.pageCount + props.pageCount
  );
  useEffect(() => {
    console.log("currentPage", currentPage);

    props.onChange &&
      props.onChange(
        currentPage * props.pageCount,
        (currentPage + 1) * props.pageCount
      );
  }, [currentPage]);

  // if (showed.length < props.pageCount) {
  //   showed = numbers.slice(props.totalPage - props.pageCount, props.totalPage);
  // }
  const backDisabled = idx === 0;
  const nextDisabled = idx >= groups.length - 1;
  if (showed.length === 0) {
    return <></>;
  }

  return (
    <X gap={2}>
      <Button
        onClick={() => {
          if (idx - 1 >= 0) setIdx(idx - 1);
        }}
        variant={"text"}
        icon={<FaChevronLeft css={tw`fill-current`} />}
        tone={tone}
        disabled={backDisabled}
      ></Button>
      {showed.map((s) => {
        return (
          <Button
            variant={s === currentPage ? "primary" : "dim"}
            tone={tone}
            onClick={() => setCurrentPage(s)}
          >
            {s + 1}
          </Button>
        );
      })}
      <Button
        onClick={() => {
          if (idx + 1 <= groups.length) setIdx(idx + 1);
        }}
        variant={"text"}
        icon={<FaChevronRight css={tw`fill-current`} />}
        tone={tone}
        disabled={nextDisabled}
      ></Button>
    </X>
  );
};
