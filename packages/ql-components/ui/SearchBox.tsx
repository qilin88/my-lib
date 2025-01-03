/*
 * @Author: aa 1019921999@qq.com
 * @Date: 2024-11-21 16:10:28
 * @LastEditors: aa 1019921999@qq.com
 * @LastEditTime: 2024-11-25 23:16:30
 * @FilePath: /my-interface/src/components/SearchBox.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// components/CustomButton.tsx
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

const CustomButton = styled(Button)({
  padding: '12px 48px',
  backgroundColor: '#48e59b',
  borderRadius: '9999px',
  color: 'rgba(0, 0, 0, 0.8)',
  fontSize: '16px',
  fontWeight: 500,
  fontFamily: 'Roboto Mono',
  lineHeight: 1,
  textTransform: 'none',
  '&:hover': {
    backgroundColor: '#48e59b',
  },
});

export interface CustomButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export const SearchButton: React.FC<CustomButtonProps> = ({
  children,
  onClick,
}) => {
  return (
    <CustomButton disableElevation onClick={onClick}>
      {children}
    </CustomButton>
  );
};

export default SearchButton;
