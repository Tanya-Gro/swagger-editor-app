'use client';

import { useActionState, useEffect } from 'react';
import { type LogoutState, type LogoutAction } from '@/types';
import { toast } from '@/utils/toast/toast';
import { Button } from '@mui/material';
import { LogoutOutlined } from '@mui/icons-material';

type LogoutProps = {
  action: LogoutAction;
  label: string;
  className?: string;
};

const initialState: LogoutState = {
  error: null,
};

export function Logout({ action, label, className }: LogoutProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
    }
  }, [state.error]);

  return (
    <form action={formAction}>
      <Button
        startIcon={<LogoutOutlined />}
        variant="contained"
        type="submit"
        loading={isPending}
        className={className}
      >
        {label}
      </Button>
    </form>
  );
}
